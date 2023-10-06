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

const server = require("../middleware/server");

const usersInput = new GraphQLInputObjectType({
  name: "usersInput",
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

const users = new GraphQLObjectType({
  name: "users",
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
  let newData = [];
  data.map((item) => {
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
    } = item;

    const created = createdAt?.toLocaleDateString();
    const updated = updatedAt?.toLocaleDateString();
    // const created = JSON.stringify(createdAt).split("T")[0];
    // const updated = JSON.stringify(updatedAt).split("T")[0];
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
    return (newData = [...newData, newObj]);
  });
  return newData;
};

const bulkAddUsers = {
  type: GraphQLNonNull(GraphQLList(users)),
  description: "Add all users from kaycad database",
  resolve: async (parent, args) => {
    // Current Users Record on Portflio Database
    const portfolioUsers = await userModel.find({}, { email: 1, _id: 0 });

    // Latest Users Record on KayCad Database
    const kayCadResponse = await server.get("/admin/fetchAll");
    const kayCadUsers = kayCadResponse.data.response;

    // New Record on KayCad Database which is not yet on Portfolio Database
    const newKayCadUsers = kayCadUsers.filter((kaycadUser) => {
      return (
        portfolioUsers.filter((portfolioUser) => {
          return portfolioUser.email == kaycadUser.email;
        }).length == 0
      );
    });

    try {
      newKayCadUsers.map(async (user) => {
        const { userId, surname, otherName, email, passport, password, role } =
          user;
        await userModel.create({
          userId,
          surname,
          otherName,
          email,
          passport,
          password,
          role,
        });
      });
    } catch (err) {
      throw new GraphQLError(
        "Unable to save user record from KayCad on Portfolio " + err
      );
    } finally {
      if (newKayCadUsers.length > 0) {
        return newKayCadUsers;
      } else if (kayCadUsers.length < 1) {
        throw new GraphQLError(`No user record found on KayCad Database`);
      } else if (newKayCadUsers.length < 1) {
        throw new GraphQLError(`No new user record found on KayCad Database`);
      } else if (!kayCadUsers) {
        throw new GraphQLError(`Unable to get data from KayCad Database`);
      } else {
        throw new GraphQLError(
          `Unknown Error while trying to connect to KayCad Database`
        );
      }
    }
  },
};

module.exports = { bulkAddUsers };
