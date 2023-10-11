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
    const result = await userModel?.findOne({
      email: args?.email,
    });

    if (result?.length < 1 || result == null) {
      throw new GraphQLError(
        `${args.email} does not exist, Kindly check and try again`
      );
    }


    var otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    req.app.locals.otp = {email: args.email, otp:parseInt(otp)}
    req.app.locals.resetSession = false
    const emailContent = `Dear ${args.email}, \nKindly find below the authorization OTP requested for you password reset. \n${otp}. \nCheers,`
    const optSent = await sendMail("Password Reset OTP", args?.email, emailContent)
    // console.log(optSent);
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

    var otp = req?.app?.locals?.otp
    var code = {email: args?.email, otp:parseInt(args?.otp)}
    console.log(`express otp = ${otp?.otp}`)
      const sessionClose = req?.app?.locals?.resetSession
    if (sessionClose === true){
      throw new GraphQLError(
        'OTP expired'
      );
    }

    if(otp?.email === code?.email && otp?.otp === code?.otp) {
      const response = { message: `Valid ${otp?.otp}` }
      req.app.locals.otp = null
      req.app.locals.resetSession = true
      return response
    }
    else {throw new GraphQLError(
        `Invalid OTP ${otp?.otp}`
      );
    }

  },
};

module.exports = { validateUser, passResetReq, resetPassword, confirmOtp };
