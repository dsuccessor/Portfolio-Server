const {
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
const {
  languageModel,
  projectModel,
  skillModel,
  mediaModel,
} = require("../models/portfolioTablesModel");
const { loginAuth } = require("../middleware/auth");

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

// Languages Table
const languages = new GraphQLObjectType({
  name: "languages",
  description: "Languages Table",
  fields: () => ({
    id: { type: GraphQLID },
    // languageId: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    logo: { type: GraphQLString },
    level: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// projects Table
const projects = new GraphQLObjectType({
  name: "projects",
  description: "Projects Table",
  fields: () => ({
    id: { type: GraphQLID },
    // projectId: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    flyer: { type: GraphQLString },
    technologies: {
      type: GraphQLList(GraphQLString),
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// skills Table
const skills = new GraphQLObjectType({
  name: "skills",
  description: "Skills Table ",
  fields: () => ({
    id: { type: GraphQLID },
    // skillId: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    logo: { type: GraphQLString },
    level: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Medias Table
const medias = new GraphQLObjectType({
  name: "medias",
  description: "Medias Table",
  fields: () => ({
    id: { type: GraphQLID },
    // mediaId: { type: GraphQLInt },
    name: { type: GraphQLString },
    handle: { type: GraphQLString },
    logo: { type: GraphQLString },
    link: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const convertDate = (data) => {
  let newData = [];
  data.map((item) => {
    const {
      id,
      name,
      description,
      handle,
      logo,
      flyer,
      level,
      technologies,
      link,
      createdAt,
      updatedAt,
    } = item;
    const created = createdAt?.toLocaleDateString();
    const updated = updatedAt?.toLocaleDateString();
    // const created = JSON.stringify(createdAt).split("T")[0];
    // const updated = JSON.stringify(updatedAt).split("T")[0];
    const newObj = {
      id,
      // languageId,
      // projectId,
      // mediaId,
      // skillId,
      name,
      description,
      handle,
      logo,
      flyer,
      level,
      technologies,
      link,
      createdAt: created,
      updatedAt: updated,
    };
    return (newData = [...newData, newObj]);
  });
  return newData;
};

const levelEnum = new GraphQLEnumType({
  name: "levelOptions",
  values: {
    Beginner: { value: "beginner" },
    Intermediate: { value: "intermediate" },
    Advance: { value: "advance" },
    Professional: { value: "professional" },
  },
});

//Language Table FETCH queries
const getLanguageById = {
  type: languages,
  description: "Fetch language by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return languageModel.findById(args.id);
  },
};
const getLanguages = {
  type: GraphQLList(languages),
  description: "Fetch all languages",
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const result = await languageModel.find();
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

//Project Table FETCH queries
const getProjectById = {
  type: projects,
  description: "Fetch project by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return projectModel.findById(args.id);
  },
};
const getProjects = {
  type: GraphQLList(projects),
  description: "Fetch all projects",
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const result = await projectModel.find();
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

//Skill Table FETCH queries
const getSkillById = {
  type: skills,
  description: "Fetch skill by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return skillModel.findById(args.id);
  },
};
const getSkills = {
  type: GraphQLList(skills),
  description: "Fetch all skills",
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const result = await skillModel.find();
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

//Media Table FETCH queries
const getMediaById = {
  type: medias,
  description: "Fetch media by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return mediaModel.findById(args.id);
  },
};
const getMedias = {
  type: GraphQLList(medias),
  description: "Fetch all medias",
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const result = await mediaModel.find();
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

//Language Table POST Queries

const addLanguage = {
  type: languages,
  description: "Add a language",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    logo: { type: GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLNonNull(levelEnum) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const languageRecord = {
      name: args.name,
      description: args.description,
      logo: args.logo,
      level: args.level,
    };

    const { name, description, logo, level } = args;

    const languageArr = [name, description, logo, level];

    const emptyArg = languageArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const create = await languageModel.create({
      name,
      description,
      logo,
      level,
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
const deleteLanguageById = {
  type: languages,
  description: "Delete a language by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return languageModel.findByIdAndDelete(args.id);
  },
};
const updateLanguageById = {
  type: languages,
  description: "Update a language by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    level: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const updateRecord = {
      level: args.level,
    };

    return languageModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
  },
};

//Project Table POST Queries

const addProject = {
  type: projects,
  description: "Add a project",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    flyer: { type: GraphQLNonNull(GraphQLString) },
    technologies: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const projectRecord = {
      name: args.name,
      description: args.description,
      flyer: args.flyer,
      technologies: args.technologies,
    };

    const { name, description, flyer, technologies } = args;

    const projectArr = [name, description, flyer, technologies];

    const emptyArg = projectArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const create = await projectModel.create({
      name,
      description,
      flyer,
      technologies,
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
const deleteProjectById = {
  type: projects,
  description: "Delete a project by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return projectModel.findByIdAndDelete(args.id);
  },
};
const updateProjectById = {
  type: projects,
  description: "Update a project by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    flyer: { type: GraphQLNonNull(GraphQLString) },
    technologies: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const updateRecord = {
      flyer: args.flyer,
      technologies: args.technologies,
    };

    return projectModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
  },
};

//Skill Table POST Queries

const addSkill = {
  type: skills,
  description: "Add a skill",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    logo: { type: GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLNonNull(levelEnum) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const skillRecord = {
      name: args.name,
      description: args.description,
      logo: args.logo,
      level: args.level,
    };

    const { name, description, logo, level } = args;

    const skillArr = [name, description, logo, level];

    const emptyArg = skillArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const create = await skillModel.create({
      name,
      description,
      logo,
      level,
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
const deleteSkillById = {
  type: skills,
  description: "Delete a skill by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return skillModel.findByIdAndDelete(args.id);
  },
};
const updateSkillById = {
  type: skills,
  description: "Update a skill by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    level: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const updateRecord = {
      level: args.level,
    };

    return skillModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
  },
};

//Media Table POST Queries

const addMedia = {
  type: medias,
  description: "Add a media",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    handle: { type: GraphQLNonNull(GraphQLString) },
    logo: { type: GraphQLNonNull(GraphQLString) },
    link: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const mediaRecord = {
      name: args.name,
      handle: args.handle,
      logo: args.logo,
      link: args.link,
    };

    const { name, handle, logo, link } = args;

    const mediaArr = [name, handle, logo, link];

    const emptyArg = mediaArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const create = await mediaModel.create({
      name,
      handle,
      logo,
      link,
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
const deleteMediaById = {
  type: medias,
  description: "Delete a media by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    return mediaModel.findByIdAndDelete(args.id);
  },
};
const updateMediaById = {
  type: medias,
  description: "Update a media by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    handle: { type: GraphQLNonNull(GraphQLString) },
    link: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, {req}) => {
     // Validating user Authorization Code
      const decode = await loginAuth(req);
      console.log(decode);
    const updateRecord = {
      handle: args.handle,
      link: args.link,
    };

    return mediaModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
  },
};

module.exports = {
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
};
