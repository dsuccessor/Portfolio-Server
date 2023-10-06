const { getCvDb, postToCvDb } = require("../controls/cvControl");

const { bulkAddUsers } = require("../controls/usersControl");
const { validateUser } = require("../controls/userLogin");

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

const {
  getObjectiveById,
  getObjectives,
  getEducationById,
  getEducations,
  getExperienceById,
  getExperiences,
  getAwardById,
  getAwards,
  getCvLanguageById,
  getCvLanguages,
  getCertificationById,
  getCertifications,
  getHobbyById,
  getHobbies,
  addObjective,
  addEducation,
  addExperience,
  addAward,
  addCvLanguage,
  addCertification,
  addHobby,
  deleteObjectiveById,
  deleteEducationById,
  deleteExperienceById,
  deleteAwardById,
  deleteCvLanguageById,
  deleteCertificationById,
  deleteHobbyById,
  updateExperienceById,
  updateObjectiveById,
  updateEducationById,
  updateAwardById,
  updateCvLanguageById,
  updateCertificationById,
  updateHobbyById,
} = require("../controls/resumeeControl");

const expressGraphQL = require("express-graphql").graphqlHTTP;
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const rootQuery = new GraphQLObjectType({
  name: "fetchEndpoints",
  description: "Enpoints for fetching datas",
  fields: () => ({
    validateUser,
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
    getObjectiveById,
    getObjectives,
    getEducationById,
    getEducations,
    getExperienceById,
    getExperiences,
    getAwardById,
    getAwards,
    getCvLanguageById,
    getCvLanguages,
    getCertificationById,
    getCertifications,
    getHobbyById,
    getHobbies,
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
    updateExperienceById,
    addObjective,
    addEducation,
    addExperience,
    addAward,
    addAward,
    addCvLanguage,
    addCertification,
    addHobby,
    deleteObjectiveById,
    deleteEducationById,
    deleteExperienceById,
    deleteAwardById,
    deleteCvLanguageById,
    deleteCertificationById,
    deleteHobbyById,
    updateExperienceById,
    updateObjectiveById,
    updateEducationById,
    updateAwardById,
    updateCvLanguageById,
    updateCertificationById,
    updateHobbyById,
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
