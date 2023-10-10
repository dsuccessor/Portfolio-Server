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
    console.log(result);
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
    console.log(result);
    if (result?.length < 1 || result == null) {
      throw new GraphQLError(
        `${args.email} does not exist, Kindly check and try again`
      );
    }
    const otp = Math.floor(Math.random() * 1000000);
    req.session.otp = JSON.stringify(otp);
    console.log(req.session.otp)
    req.session.save();
    const optSent = await sendMail("Password Reset OTP", args?.email, JSON.stringify(otp))
   
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
        $set: {password: args.password},
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
    const otp = req.session.otp
    console.log(otp)

    if (otp == args.otp){
      const response = {message: `Valid ${otp}`}
      return response
    }
    else {
      throw new GraphQLError(
        `Invalid OTP ${otp}`
      );
    }

  },
};

module.exports = { validateUser, passResetReq, resetPassword,  confirmOtp};
