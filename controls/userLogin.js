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
    _id: { type: GraphQLID },
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

//function to convert date
const convertDate = (data) => {
  const {
    _id,
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
    _id,
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

module.exports = { validateUser };
