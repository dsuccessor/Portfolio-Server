const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLNonNull,
  Token,
  GraphQLUnionType,
} = require("graphql");

const userModel = require("../models/usersModel");
const { sendMail } = require("../service/mailService");
const otpGenerator = require("otp-generator");
const confirmPermission = require("../middleware/rolesAndPermissions")
const { json } = require("express");
const { default: mongoose } = require("mongoose");
const { auth, closeSession, createPassResetAuth, createLoginAuth, validateLogin } = require('../middleware/auth');
const jwt = require("jsonwebtoken");
const store = require("..");
const session = require("express-session");


//Login Table Input Structure
const loginInput = new GraphQLInputObjectType({
  name: "loginInput",
  description: "Login table input structure",
  fields: () => ({
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    newPassword: { type: GraphQLNonNull(GraphQLString) },
  }),
});

//Login Output Table Structure
const login = new GraphQLObjectType({
  name: "login",
  description: "Users Table",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLInt },
    surname: { type: GraphQLString },
    otherName: { type: GraphQLString },
    email: { type: GraphQLString },
    passport: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

// Error Type

const errorType = new GraphQLObjectType({
  name: "errorType",
  description: "Error Type",
  fields: ()=>({
    errorCode: {type: GraphQLString},
    errorMessage: {type: GraphQLString},
    errorDescription: {type: GraphQLString},
    errorLocation: {type: GraphQLString}
  })
})

// Error Type
const error = new GraphQLObjectType({
  name: "error",
  description: "Error Payload",
  fields: ()=>({
    status: {type: GraphQLString},
    errors: {type: errorType}
  })
})

const loginPayload = new GraphQLUnionType({
  name: "loginPayload",
  description: "union type for both Login & Its error",
  types: [login, error],
  resolveType(value){
    if(value.status === "Failed"){
      return error
    }
    if(value.id){
      return login
    }
  }
  
})

//Login Output Table Structure
const otpTable = new GraphQLObjectType({
  name: "otp",
  description: "OTP Table",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

//function to convert date
const convertDate = (data) => {
  const {
    id,
    surname,
    otherName,
    email,
    passport,
    password,
    role,
    createdAt,
    updatedAt,
    userId,
  } = data;

  const created = createdAt?.toLocaleDateString();
  const updated = updatedAt?.toLocaleDateString();

  const newObj = {
    id,
    surname,
    otherName,
    email,
    passport,
    password,
    role,
    createdAt: created,
    updatedAt: updated,
    userId,
  };

  return newObj;
};

const validateUser = {
  type: loginPayload,
  description: "Api for validating admin user and login attempt",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, {req, res, next}) => {

    const result = await validateLogin(args)

    if (result === false) {
  
     return  {
      status: "Failed",
      errors: {
        errorCode: "03",
        errorMessage: `Admin with ${args.email} and ${args.password} does not exist, Kindly check and try again`,
        errorDescription: "Error while trying to confirm login credential on login db",
        errorLocation: "querying login DB on validateLogin"
      }
  }
    }

    const loginToken = await createLoginAuth(args)

    if (!loginToken) {
      //throw new GraphQLError("Unable to create Authorization key for user")
      return {
        status: "Failed",
        errors: {
          errorCode: "01",
          errorMessage: "Unable to create Authorization key for user",
          errorDescription: "Having issue generating Auth Key",
          errorLocation: "createLoginAuth"
        }
    }
    }
   
    const response = convertDate(result);

    const cp = await confirmPermission("login", response.role, req, next);

    response.token = loginToken
    res.header("auth-token", loginToken)
    return response;
  },
};



const passResetReq = {
  type: login,
  description: "Api for validating user and initiating otp to the user's email",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req, res }) => {

    // Checking if user supplied all needed info
    if (!args) {
      throw new GraphQLError("Email must be provided")
    }

    // req.app.locals.sessionID = null
    // req.app.locals.resetSession = true

    const result = await userModel?.findOne({
      email: args?.email,
    });

    if (result?.length < 1 || result == null) {
      throw new GraphQLError(
        `${args.email} do not exist, Kindly confirm and try again`
      );
    }

    const token = await createPassResetAuth(args)

    if (!token) {
      throw new GraphQLError("Unable to create Authorization key for user")
    }

    var otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    req.session.otp = { email: args.email, otp: parseInt(otp) }
    const emailContent = `Dear ${args.email}, \nKindly find below the authorization OTP requested for you password reset. \n${otp}. \nCheers,`

    await sendMail("Password Reset OTP", args?.email, emailContent)
    console.log('generate otp & send to mail' + JSON.stringify(req?.session?.otp));
    console.log(req.sessionID)

    const response = convertDate(result);
    response.token = token
    res.header("auth-token", token)
    return response;
  },
};

const confirmOtp = {
  type: otpTable,
  description: "Api to confirm validity of OTP for password reset",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    otp: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    console.log("cookie = ", req?.cookie);
    // Checking if user provide the needed info
    if (!args) {
      throw new GraphQLError("Email and OTP must be provided")
    }

    // Validating user Authorization Code
    const decode = await auth(args, req);
    console.log(decode);

    // Converting OTP from user to Int 
    var code = { email: args?.email, otp: parseInt(args?.otp) }

    // const sid = req?.app?.locals?.sessionID
    // const sidValidity = req?.app?.locals?.resetSession
    // console.log('exp app sessionID ' + sid);

    // if(sid === null && sidValidity === true){
    //   throw new GraphQLError('OTP Validation Session Expired, Try Again')
    // }

    // const result = await mongoose.connection.collection('passResetOtp').findOne({_id: sid});
    // const session = result?.session?.otp;
    // console.log('otp from mongo ' + otp);
    // req.app.locals.sessionID = null
    // req.app.locals.resetSession = true

    const session = req?.session?.otp
    // Checking if OTP has been initiated
    if (!session) {
      throw new GraphQLError('OTP Expired');
    }

    // Validating OTP and Sending feedback to user
    if (session?.email === code?.email && session?.otp === code?.otp) {
      const response = { message: 'OTP Confirmed' }
      await closeSession(req)
      console.log(req.session);
      console.log(response);
      return response
    }
    else {
      throw new GraphQLError('Invalid OTP, Kindly confirm the OTP sent to your email address and try again');
    }
  },
};


const resetPassword = {
  type: login,
  description: "Api for reseting Admin User Password",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    newPassword: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    console.log(args);

    await validateLogin(args)

    const result = await userModel.findOneAndUpdate(
      { email: args.email, password: args.password }, 
      { password: args.newPassword }, 
      { new: true, returnOriginal: false })


    console.log("result", result);

    const runUpdate = convertDate(result);

    console.log("run update", runUpdate);

    if (runUpdate) {
      console.log("Password reset");
      return runUpdate;
    } else {
      console.log("Failed to reset password");
      throw new GraphQLError(
        `Failed to reset ${args.email} password,`);
    }
  },
};

module.exports = { validateUser, passResetReq, resetPassword, confirmOtp };
