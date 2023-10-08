const cvModel = require("../models/adminModel");

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql");

// experience Table Simulation Data
const experience = [
  {
    id: 1,
    company: "Accelerex Network Ltd.",
    position: "Data Analyst",
    role: "Analysing businesses data (transactions, inventories, reconciliation, managing of website etc).",
    startDate: "2018-07-01",
    endDate: "2019-01-31",
    userId: 1001,
  },
  {
    id: 2,
    company: "Ecosa Hybrid Network Ltd.",
    position: "Data Analyst/Settlement & Reconciliation",
    role: "Analysing businesses data (transactions, inventories, reconciliation, managing of website etc).",
    startDate: "2019-08-01",
    endDate: "2022-02-31",
    userId: 1002,
  },
  {
    id: 3,
    company: "Front Model Group of Schools",
    position: "Finance Data Analyst/ ERP Admin",
    role: "Analysing finance data & Managing of ERP portal.",
    startDate: "2020-05-01",
    endDate: "2022-01-31",
    userId: 1002,
  },
  {
    id: 4,
    company: "Shago Payments Ltd.",
    position: "Reconciliation & Settlement Officer",
    role: "Reconciliations of transactions (Billers, B2Bs, TPs, Agents, Statement of Account, POS Settlements etc.",
    startDate: "2022-03-01",
    endDate: "2023-01-31",
    userId: 1004,
  },
  {
    id: 5,
    company: "Alerzo Ltd.",
    position: "Deputy Manager, Tech., Support.",
    role: "Leading the team incharge of resolving issues related to Tech, POSes, MPOSes, POS Apps, MPOS Apps, and Mobile Apps.",
    startDate: "2023-02-01",
    endDate: "till Date",
    userId: 1001,
  },
];

// userProfile Table Simulation Data
const userProfile = [
  {
    userId: 1001,
    fullName: "Salaudeen Kehinde",
    age: 29,
    address: "No 15, Iyemoja Street, Mafoluku, Oshodi",
    state: "Lagos",
    contact: "09062202857",
  },
  {
    userId: 1002,
    fullName: "Aeyemo Abdurrahman",
    age: 27,
    address: "No 15, Iyemoja Street, Mafoluku, Oshodi",
    state: "Oyo",
    contact: "09062202857",
  },
  {
    userId: 1003,
    fullName: "Badmus Barikah",
    age: 25,
    address: "No 15, Iyemoja Street, Mafoluku, Oshodi",
    state: "Ogun",
    contact: "09062202857",
  },
  {
    userId: 1004,
    fullName: "Oluselu Oluwaemi",
    age: 28,
    address: "No 15, Iyemoja Street, Mafoluku, Oshodi",
    state: "Ogun",
    contact: "09062202857",
  },
];

// Structure for experience Table
const experienceTable = new GraphQLObjectType({
  name: "experience",
  description: "Experience Table",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    company: { type: GraphQLNonNull(GraphQLString) },
    position: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
    startDate: { type: GraphQLNonNull(GraphQLString) },
    endDate: { type: GraphQLString },
    userId: { type: GraphQLNonNull(GraphQLInt) },
    userProfile: {
      type: userProfileTable,
      resolve: (experience) => {
        return userProfile.find((user) => user.userId === experience.userId);
      },
    },
  }),
});

// Structure for userProfile Table
const userProfileTable = new GraphQLObjectType({
  name: "userProfile",
  description: "User Profile Table",
  fields: () => ({
    userId: { type: GraphQLNonNull(GraphQLInt) },
    fullName: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    address: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    contact: { type: GraphQLString },
    experiences: {
      type: GraphQLList(experienceTable),
      resolve: (userProfile) => {
        return experience.filter((item) => item.userId === userProfile.userId);
      },
    },
  }),
});

//Queries GET made on CV DB
const getCvDb = new GraphQLObjectType({
  name: "getCvDatabase",
  description: "CV Database",
  fields: () => ({
    experience: {
      type: experienceTable,
      description: "Single user experiences",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return experience.find((item) => item.id === args.id);
      },
    },
    experiences: {
      type: new GraphQLList(experienceTable),
      description: "List of users experiences",
      resolve: () => experience,
    },
    profile: {
      type: userProfileTable,
      description: "Single user profile",
      args: {
        userId: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return userProfile.find((item) => item.userId === args.userId);
      },
    },
    profiles: {
      type: new GraphQLList(userProfileTable),
      description: "List of users profile",
      resolve: () => userProfile,
    },
  }),
});

//Queries POST made on CV DB
const postToCvDb = new GraphQLObjectType({
  name: "addCv",
  description: "Add data to database cv",
  fields: () => ({
    addExpereince: {
      type: experienceTable,
      description: "Add data to experience table",
      args: {
        company: { type: GraphQLNonNull(GraphQLString) },
        position: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(GraphQLString) },
        startDate: { type: GraphQLNonNull(GraphQLString) },
        endDate: { type: GraphQLString },
        userId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const addNewData = {
          id: experience.length + 1,
          company: args.company,
          position: args.position,
          role: args.role,
          startDate: args.startDate,
          endDate: args.endDate,
          userId: args.userId,
        };
        console.log(addNewData);
        experience.push(addNewData);

        return addNewData;
      },
    },
  }),
});

module.exports = {
  getCvDb,
  postToCvDb,
};
