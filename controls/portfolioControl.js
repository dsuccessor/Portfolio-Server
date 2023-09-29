const portfolioModel = require("../models/portfolioModel");
const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLID,
  GraphQLEnumType,
  GraphQLError,
  GraphQLInputObjectType,
} = require("graphql");

// portflio table languages
const languagesInput = new GraphQLInputObjectType({
  name: "languagesInput",
  description: "portfolio Table languages",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    logo: { type: GraphQLString },
    level: { type: GraphQLString },
  }),
});

// portflio table projects
const projectsInput = new GraphQLInputObjectType({
  name: "projectsInput",
  description: "portfolio Table projects",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    flyer: { type: GraphQLString },
    technologies: {
      type: GraphQLList(GraphQLString),
    },
  }),
});

// portflio table skills
const skillsInput = new GraphQLInputObjectType({
  name: "skillsInput",
  description: "portfolio Table skills",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    logo: { type: GraphQLString },
    level: { type: GraphQLString },
  }),
});

// portflio table medias
const mediasInput = new GraphQLInputObjectType({
  name: "mediasInput",
  description: "portfolio Table medias",
  fields: () => ({
    name: { type: GraphQLString },
    handle: { type: GraphQLString },
    logo: { type: GraphQLString },
    link: { type: GraphQLString },
  }),
});

const languages = new GraphQLObjectType({
  name: "portLanguages",
  description: "portfolio Table languages",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    logo: { type: GraphQLString },
    level: { type: GraphQLString },
  }),
});

// portflio table projects
const projects = new GraphQLObjectType({
  name: "portProjects",
  description: "portfolio Table projects",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    flyer: { type: GraphQLString },
    technologies: {
      type: GraphQLList(GraphQLString),
    },
  }),
});

// portflio table skills
const skills = new GraphQLObjectType({
  name: "portSkills",
  description: "portfolio Table skills",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    logo: { type: GraphQLString },
    level: { type: GraphQLString },
  }),
});

// portflio table medias
const medias = new GraphQLObjectType({
  name: "portMedias",
  description: "portfolio Table medias",
  fields: () => ({
    name: { type: GraphQLString },
    handle: { type: GraphQLString },
    logo: { type: GraphQLString },
    link: { type: GraphQLString },
  }),
});

// portfolio Table
const portfolioTable = new GraphQLObjectType({
  name: "portfolio",
  description: "portfolio Table",
  fields: () => ({
    id: { type: GraphQLID },
    portfolioId: { type: GraphQLInt },
    languages: { type: GraphQLList(languages) },
    projects: { type: GraphQLList(projects) },
    skills: { type: GraphQLList(skills) },
    medias: { type: GraphQLList(medias) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    message: {
      type: GraphQLString,
      resolve: (portfolio) => {
        console.log(portfolio);
        return portfolio.portfolioId != null ? "Success" : "Failed";
      },
    },
  }),
});

const convertDate = (data) => {
  let newData = [];
  data.map((item) => {
    const {
      id,
      languages,
      projects,
      skills,
      medias,
      portfolioId,
      createdAt,
      updatedAt,
    } = item;
    const created = JSON.stringify(createdAt).split("T")[0];
    const updated = JSON.stringify(updatedAt).split("T")[0];
    const newObj = {
      id,
      languages,
      projects,
      skills,
      medias,
      portfolioId,
      createdAt: created,
      updatedAt: updated,
    };
    return (newData = [...newData, newObj]);
  });
  return newData;
};

//DB Portfolio Fetch queries
const getPortfolioById = {
  type: portfolioTable,
  description: "Fetch portfolio by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, args) => {
    return portfolioModel.findById(args.id);
  },
};
const getPortfolios = {
  type: GraphQLList(portfolioTable),
  description: "Fetch all portfolios",
  resolve: async (parent, args) => {
    const result = await portfolioModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for portfolios");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Queries POST made on Portfolio DB

const addPortfolio = {
  type: portfolioTable,
  description: "Add a portfolio",
  args: {
    languages: { type: GraphQLNonNull(GraphQLList(languagesInput)) },
    projects: { type: GraphQLNonNull(GraphQLList(projectsInput)) },
    skills: { type: GraphQLNonNull(GraphQLList(skillsInput)) },
    medias: { type: GraphQLNonNull(GraphQLList(mediasInput)) },
  },
  resolve: async (parent, args) => {
    const portfolioRecord = {
      languages: args.languages,
      projects: args.projects,
      skills: args.skills,
      medias: args.medias,
    };

    const { languages, projects, skills, medias } = args;

    const portfolioArr = [languages, projects, skills, medias];

    const emptyArg = portfolioArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const create = await portfolioModel.create({
      languages,
      projects,
      skills,
      medias,
    });
    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new portfolio, ` + JSON.stringify(err)
      );
    }
  },
};
const deletePortfolioById = {
  type: portfolioTable,
  description: "Delete a portfolio by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, args) => {
    return portfolioModel.findByIdAndDelete(args.id);
  },
};
const updatePortfolioById = {
  type: portfolioTable,
  description: "Update a portfolio by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    medias: { type: GraphQLNonNull(GraphQLList(mediasInput)) },
  },
  resolve: (parent, args) => {
    const updateRecord = {
      medias: args.medias,
    };

    return portfolioModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
  },
};

module.exports = {
  getPortfolioById,
  getPortfolios,
  addPortfolio,
  deletePortfolioById,
  updatePortfolioById,
};
