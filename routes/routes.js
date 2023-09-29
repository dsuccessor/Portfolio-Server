const { getCvDb, postToCvDb } = require("../controls/cvControl");

const { bulkAddUsers } = require("../controls/usersControl");

const {
  getAdminByEmail,
  getAdminById,
  getAdmins,
  addAdmin,
  deleteAdminById,
  updateAdminById,
} = require("../controls/adminControl");
const {
  getPortfolioById,
  getPortfolios,
  addPortfolio,
  deletePortfolioById,
  updatePortfolioById,
} = require("../controls/portfolioControl");
const {
  getLanguageById,
  getLanguages,
  getProjectById,
  getProjects,
  getSkillById,
  getSkills,
  getMediaById,
  getMedias,
  addLanguage,
  addProject,
  addSkill,
  addMedia,
  deleteLanguageById,
  deleteProjectById,
  deleteSkillById,
  deleteMediaById,
  updateLanguageById,
  updateProjectById,
  updateSkillById,
  updateMediaById,
} = require("../controls/portfolioTablesControl");

const expressGraphQL = require("express-graphql").graphqlHTTP;
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const rootQuery = new GraphQLObjectType({
  name: "fetchEndpoints",
  description: "Enpoints for fetching datas",
  fields: () => ({
    bulkAddUsers,
    getAdminByEmail,
    getAdminById,
    getAdmins,
    getPortfolioById,
    getPortfolios,
    getLanguageById,
    getLanguages,
    getProjectById,
    getProjects,
    getSkillById,
    getSkills,
    getMediaById,
    getMedias,
  }),
});

const rootMutation = new GraphQLObjectType({
  name: "postEndpoints",
  description: "Endpoints for posting datas",
  fields: () => ({
    addAdmin,
    deleteAdminById,
    updateAdminById,
    addPortfolio,
    deletePortfolioById,
    updatePortfolioById,
    addLanguage,
    addProject,
    addSkill,
    addMedia,
    deleteLanguageById,
    deleteProjectById,
    deleteSkillById,
    deleteMediaById,
    updateLanguageById,
    updateProjectById,
    updateSkillById,
    updateMediaById,
  }),
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

const portfolioRoute = expressGraphQL({
  schema: schema,
  graphiql: true,
});

module.exports = portfolioRoute;
