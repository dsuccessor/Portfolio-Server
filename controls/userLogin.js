const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require("graphql");

const userModel = require("../models/usersModel");
const { sendMail } = require("../service/mailService");
const otpGenerator = require("otp-generator");
const { json } = require("express");
const { default: mongoose } = require("mongoose");


//Login Table Input Structure
const loginInput = new GraphQLInputObjectType({
  name: "loginInput",
  description: "Login table input structure",
  fields: () => ({
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
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
  }),
});

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
  type: login,
  description: "Api for validating admin user and login attempt",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const result = await userModel?.findOne({
      email: args?.email,
      password: args?.password,
    });
    // console.log(result);
    if (result?.length < 1 || result == null) {
      throw new GraphQLError(
        `Admin with ${args.email} and ${args.password} does not exist, Kindly check and try again`
      );
    }

    const response = convertDate(result);

    return response;
  },
};

const passResetReq = {
  type: login,
  description: "Api for validating user and initiating otp to the user's email",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {

    req.app.locals.sessionID = null
    req.app.locals.resetSession = true

    const result = await userModel?.findOne({
      email: args?.email,
    });

    if (result?.length < 1 || result == null) {
      throw new GraphQLError(
        `${args.email} do not exist, Kindly confirm and try again`
      );
    }

    var otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    req.session.otp = { email: args.email, otp: parseInt(otp) }
    const emailContent = `Dear ${args.email}, \nKindly find below the authorization OTP requested for you password reset. \n${otp}. \nCheers,`
    
    await sendMail("Password Reset OTP", args?.email, emailContent)
    console.log('generate otp & send to mail' + JSON.stringify(req?.session?.otp));
    console.log(req.sessionID)

    req.app.locals.sessionID = req.sessionID
    req.app.locals.resetSession = false
    const response = convertDate(result);

    return response;

  },
};

const resetPassword = {
  type: login,
  description: "Api for reseting Admin User Password",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {

    const result = await userModel.findOneAndUpdate(
      args.email,
      {
        $set: { password: args.password },
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to reset ${args.email} password,`);
    }
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

    var code = { email: args?.email, otp: parseInt(args?.otp) }

    const sid = req?.app?.locals?.sessionID
    const sidValidity = req?.app?.locals?.resetSession
    console.log('exp app sessionID ' + sid);

    if(sid === null && sidValidity === true){
      throw new GraphQLError('OTP Validation Session Expired, Try Again')
    }

   const result = await mongoose.connection.collection('passResetOtp').findOne({_id: sid});
  const otp = result?.session?.otp;
  console.log('otp from mongo ' + otp);

   if (otp == null || otp?.length < 1){
    req.app.locals.sessionID = null
    req.app.locals.resetSession = true
        throw new GraphQLError('OTP Expired');
      }

      if (otp?.email === code?.email && otp?.otp === code?.otp) {
        const response = { message: 'OTP Confirmed'}
        console.log(response);
        req.app.locals.sessionID = null
        req.app.locals.resetSession = true
        return response
      }
      else {
        throw new GraphQLError('Invalid OTP, Kindly confirm the OTP sent to your email address and try again');
      }
  },
};

module.exports = { validateUser, passResetReq, resetPassword, confirmOtp };
