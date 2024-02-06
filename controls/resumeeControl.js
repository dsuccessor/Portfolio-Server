const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLScalarType,
  Kind,
} = require("graphql");

const {
  objectiveModel,
  educationModel,
  experienceModel,
  awardModel,
  certificationModel,
  hobbyModel,
  cvlanguageModel,
} = require("../models/resumeeModel");
const { loginAuth } = require("../middleware/auth");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

// Objective Input  Table
const objectiveInput = new GraphQLInputObjectType({
  name: "objectiveInput",
  description: "Objective Table for Resumee & Cv",
  fields: () => ({
    version: { type: GraphQLString },
    summary: { type: GraphQLString },
    logo: { type: GraphQLString },
  }),
});

// Education Input  Table
const educationInput = new GraphQLInputObjectType({
  name: "educationInput",
  description: "Education Table for Resumee & Cv",
  fields: () => ({
    school: { type: GraphQLString },
    period: { type: GraphQLString },
    qualification: { type: GraphQLString },
    course: { type: GraphQLString },
    grade: { type: GraphQLString },
  }),
});

// Experience Input  Table
const experienceInput = new GraphQLInputObjectType({
  name: "experienceInput",
  description: "Experience Table for Resumee & Cv",
  fields: () => ({
    organization: { type: GraphQLString },
    role: { type: GraphQLString },
    position: { type: GraphQLString },
    period: { type: GraphQLString },
  }),
});

// Award Input  Table
const awardInput = new GraphQLInputObjectType({
  name: "awardInput",
  description: "Award Table for Resumee & Cv",
  fields: () => ({
    organization: { type: GraphQLString },
    award: { type: GraphQLString },
    logo: { type: GraphQLString },
    period: { type: GraphQLString },
  }),
});

// Certification Input  Table
const certificationInput = new GraphQLInputObjectType({
  name: "certificationInput",
  description: "Certification Table for Resumee & Cv",
  fields: () => ({
    programme: { type: GraphQLString },
    period: { type: GraphQLString },
    certificate: { type: GraphQLString },
    certification: { type: GraphQLString },
  }),
});

// Hobby Input  Table
const hobbyInput = new GraphQLInputObjectType({
  name: "hobbyInput",
  description: "Hobby Table for Resumee & Cv",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

// Cv Language Input Table
const cvLanguageInput = new GraphQLInputObjectType({
  name: "cvLanguageInput",
  description: "Language Table for Resumee & Cv",
  fields: () => ({
    language: { type: GraphQLString },
    level: { type: languageLevel },
  }),
});

// Objective Table
const objective = new GraphQLObjectType({
  name: "objective",
  description: "Objective Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    version: { type: GraphQLString },
    summary: { type: GraphQLString },
    logo: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Education Table
const education = new GraphQLObjectType({
  name: "education",
  description: "Education Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    school: { type: GraphQLString },
    period: { type: GraphQLString },
    qualification: { type: GraphQLString },
    course: { type: GraphQLString },
    grade: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Experience Table
const experience = new GraphQLObjectType({
  name: "experience",
  description: "Experience Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    organization: { type: GraphQLString },
    role: { type: GraphQLString },
    position: { type: GraphQLString },
    period: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Award Table
const award = new GraphQLObjectType({
  name: "award",
  description: "Award Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    organization: { type: GraphQLString },
    award: { type: GraphQLString },
    logo: { type: GraphQLString },
    period: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Certification Table
const certification = new GraphQLObjectType({
  name: "certification",
  description: "Certification Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    programme: { type: GraphQLString },
    period: { type: GraphQLString },
    certificate: { type: GraphQLString },
    certification: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Hobby Table
const hobby = new GraphQLObjectType({
  name: "hobby",
  description: "Hobby Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Cv Language Table
const cvLanguage = new GraphQLObjectType({
  name: "cvLanguage",
  description: "Language Table for Resumee & Cv",
  fields: () => ({
    id: { type: GraphQLID },
    language: { type: GraphQLString },
    level: { type: languageLevel },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const convertDate = (data) => {
  let newData = [];
  data.map((item) => {
    const {
      id,
      language,
      level,
      name,
      description,
      programme,
      certificate,
      certification,
      organization,
      award,
      role,
      position,
      period,
      school,
      qualification,
      course,
      grade,
      version,
      summary,
      logo,
      createdAt,
      updatedAt,
    } = item;
    var created = createdAt?.toLocaleDateString();
    // JSON.stringify(createdAt).split("T")[0];
    var updated = (created = updatedAt?.toLocaleDateString());
    //JSON.stringify(updatedAt).split("T")[0];
    const newObj = {
      id,
      language,
      level,
      name,
      description,
      programme,
      certificate,
      certification,
      organization,
      award,
      role,
      position,
      period,
      school,
      qualification,
      course,
      grade,
      version,
      summary,
      logo,
      createdAt: created,
      updatedAt: updated,
    };
    return (newData = [...newData, newObj]);
  });
  return newData;
};

const mutationConvertDate = (data) => {
  const {
    id,
    language,
    level,
    name,
    description,
    programme,
    certificate,
    certification,
    organization,
    award,
    role,
    position,
    period,
    school,
    qualification,
    course,
    grade,
    version,
    summary,
    logo,
    createdAt,
    updatedAt,
  } = data;

  var created = createdAt?.toLocaleDateString();
  // JSON.stringify(createdAt).split("T")[0];
  var updated = (created = updatedAt?.toLocaleDateString());
  //JSON.stringify(updatedAt).split("T")[0];

  const newObj = {
    id,
    language,
    level,
    name,
    description,
    programme,
    certificate,
    certification,
    organization,
    award,
    role,
    position,
    period,
    school,
    qualification,
    course,
    grade,
    version,
    summary,
    logo,
    createdAt: created,
    updatedAt: updated,
  };

  return newObj;
};

const languageLevel = new GraphQLEnumType({
  name: "level",
  values: {
    Basic: { value: "basic" },
    Fluent: { value: "fluent" },
  },
});

//Objective Table FETCH queries
const getObjectiveById = {
  type: objective,
  description: "Fetch objective by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await objectiveModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(`No record found for ${args?.id} on objective`);
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getObjectives = {
  type: GraphQLList(objective),
  description: "Fetch all objectives",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await objectiveModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for objectives");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Education Table FETCH queries
const getEducationById = {
  type: education,
  description: "Fetch education by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await educationModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(`No record found for ${args?.id} on education`);
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getEducations = {
  type: GraphQLList(education),
  description: "Fetch all educations",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await educationModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for educations");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Experience Table FETCH queries
const getExperienceById = {
  type: experience,
  description: "Fetch experience by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await experienceModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(`No record found for ${args?.id} on experience`);
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getExperiences = {
  type: GraphQLList(experience),
  description: "Fetch all experiences",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await experienceModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for experiences");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Award Table FETCH queries
const getAwardById = {
  type: award,
  description: "Fetch award by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await awardModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(`No record found for ${args?.id} on award`);
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getAwards = {
  type: GraphQLList(award),
  description: "Fetch all awards",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await awardModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for awards");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Cv Language Table FETCH queries
const getCvLanguageById = {
  type: cvLanguage,
  description: "Fetch Cv Language by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await cvlanguageModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(`No record found for ${args?.id} on Cv Language`);
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getCvLanguages = {
  type: GraphQLList(cvLanguage),
  description: "Fetch all Cv Languages",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await cvlanguageModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for cv Languages");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Certification Table FETCH queries
const getCertificationById = {
  type: certification,
  description: "Fetch certification by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await certificationModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(
        `No record found for ${args?.id} on certification`
      );
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getCertifications = {
  type: GraphQLList(certification),
  description: "Fetch all certifications",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await certificationModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for certifications");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Hobby Table FETCH queries
const getHobbyById = {
  type: hobby,
  description: "Fetch hobby by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await hobbyModel.findById(args.id);
    const serverResponse = convertDate(result);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError(`No record found for ${args?.id} on hobby`);
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

const getHobbies = {
  type: GraphQLList(hobby),
  description: "Fetch all hobbies",
  args: {
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await hobbyModel.find();
    const serverResponse = convertDate(result);
    console.log(serverResponse);
    if (result.length > 0) {
      return serverResponse;
    } else if (result === 0) {
      throw new GraphQLError("No record found for hobbies");
    } else {
      throw new GraphQLError({
        errors,
      });
    }
  },
};

//Objective Table POST Queries

const addObjective = {
  type: objective,
  description: "Add an objective",
  args: {
    platform: { type: GraphQLString },
    version: { type: GraphQLNonNull(GraphQLString) },
    summary: { type: GraphQLNonNull(GraphQLString) },
    logo: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { version, summary, logo } = args;

    const objArr = [version, summary, logo];

    const emptyArg = objArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await objectiveModel.create({
      version,
      summary,
      logo,
    });
    const create = mutationConvertDate(result);
    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new objective, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteObjectiveById = {
  type: objective,
  description: "Delete an objective by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await objectiveModel.findByIdAndDelete(args.id);
    const create = mutationConvertDate(result);
    return create;
  },
};

const updateObjectiveById = {
  type: objective,
  description: "Update an objective by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    version: { type: GraphQLString },
    summary: { type: GraphQLString },
    logo: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const updateRecord = Object.keys(args)
      .filter((key) => args[key] != null && args[key] !== "")
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: args[key] });
      }, {});

    const recordCount = Object.keys(updateRecord);

    if (recordCount.length < 2 || recordCount === null) {
      throw new GraphQLError(
        `No update data provided, Kindly provide atleast one data to update `
      );
    }

    const result = await objectiveModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);
    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} on objective record, ` + JSON.stringify(err)
      );
    }
  },
};

//Education Table POST Queries

const addEducation = {
  type: education,
  description: "Add an education",
  args: {
    platform: { type: GraphQLString },
    school: { type: GraphQLNonNull(GraphQLString) },
    period: { type: GraphQLNonNull(GraphQLString) },
    qualification: { type: GraphQLNonNull(GraphQLString) },
    course: { type: GraphQLNonNull(GraphQLString) },
    grade: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { school, period, qualification, course, grade } = args;

    const eduArr = [school, period, qualification, course, grade];

    const emptyArg = eduArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await educationModel.create({
      school,
      period,
      qualification,
      course,
      grade,
    });

    const create = mutationConvertDate(result);

    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new education, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteEducationById = {
  type: education,
  description: "Delete an education by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await educationModel.findByIdAndDelete(args.id);
    return mutationConvertDate(result);
  },
};

const updateEducationById = {
  type: education,
  description: "Update an education by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    school: { type: GraphQLString },
    period: { type: GraphQLString },
    qualification: { type: GraphQLString },
    course: { type: GraphQLString },
    grade: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const updateRecord = Object.keys(args)
      .filter((key) => args[key] != null && args[key] !== "")
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: args[key] });
      }, {});

    const recordCount = Object.keys(updateRecord);

    if (recordCount.length < 2 || recordCount === null) {
      throw new GraphQLError(
        `No update data provided, Kindly provide atleast one data to update `
      );
    }

    const result = await educationModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} on education record, ` + JSON.stringify(err)
      );
    }
  },
};

const addExperience = {
  type: experience,
  description: "Add an experience",
  args: {
    platform: { type: GraphQLString },
    organization: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
    position: { type: GraphQLNonNull(GraphQLString) },
    period: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { organization, role, position, period } = args;

    const expArr = [organization, role, position, period];

    const emptyArg = expArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await experienceModel.create({
      organization,
      role,
      position,
      period,
    });

    const create = mutationConvertDate(result);

    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new experience, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteExperienceById = {
  type: experience,
  description: "Delete an experience by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await experienceModel.findByIdAndDelete(args.id);

    return mutationConvertDate(result);
  },
};

const updateExperienceById = {
  type: experience,
  description: "Update an experience by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    organization: { type: GraphQLString },
    role: { type: GraphQLString },
    position: { type: GraphQLString },
    period: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const updateRecord = Object.keys(args)
      .filter((key) => args[key] != null && args[key] !== "")
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: args[key] });
      }, {});

    const recordCount = Object.keys(updateRecord);

    if (recordCount.length < 2 || recordCount === null) {
      throw new GraphQLError(
        `No update data provided, Kindly provide atleast one data to update `
      );
    }

    const result = await experienceModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} experience record, ` + JSON.stringify(err)
      );
    }
  },
};

//Award Table POST Queries

const addAward = {
  type: award,
  description: "Add an award",
  args: {
    platform: { type: GraphQLString },
    organization: { type: GraphQLNonNull(GraphQLString) },
    award: { type: GraphQLNonNull(GraphQLString) },
    logo: { type: GraphQLNonNull(GraphQLString) },
    period: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { organization, award, logo, period } = args;

    const awardArr = [organization, award, logo, period];

    const emptyArg = awardArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await awardModel.create({
      organization,
      award,
      logo,
      period,
    });

    const create = mutationConvertDate(result);

    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new award, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteAwardById = {
  type: award,
  description: "Delete an award by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await awardModel.findByIdAndDelete(args.id);
    return mutationConvertDate(result);
  },
};

const updateAwardById = {
  type: award,
  description: "Update an award by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    organization: { type: GraphQLString },
    award: { type: GraphQLString },
    logo: { type: GraphQLString },
    period: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const updateRecord = Object.keys(args)
      .filter((key) => args[key] != null && args[key] !== "")
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: args[key] });
      }, {});

    const recordCount = Object.keys(updateRecord);

    if (recordCount.length < 2 || recordCount === null) {
      throw new GraphQLError(
        `No update data provided, Kindly provide atleast one data to update `
      );
    }

    const result = await experienceModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} on award record, ` + JSON.stringify(err)
      );
    }
  },
};

const addCvLanguage = {
  type: cvLanguage,
  description: "Add a Cv Language",
  args: {
    platform: { type: GraphQLString },
    language: { type: GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLNonNull(languageLevel) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { language, level } = args;

    const cvLangArr = [language, level];

    const emptyArg = cvLangArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await cvlanguageModel.create({
      language,
      level,
    });

    const create = mutationConvertDate(result);

    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new Cv Language, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteCvLanguageById = {
  type: cvLanguage,
  description: "Delete a Cv Language by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await cvlanguageModel.findByIdAndDelete(args.id);
    return mutationConvertDate(result);
  },
};

const updateCvLanguageById = {
  type: cvLanguage,
  description: "Update a Cv Language by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    language: { type: GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLNonNull(languageLevel) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { id, language, level } = args;

    const cvLangArr = [id, language, level];

    const emptyArg = cvLangArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing update value(s)`
      );
    }

    const updateRecord = {
      language,
      level,
    };

    const result = await cvlanguageModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} on Cv Language record, ` + JSON.stringify(err)
      );
    }
  },
};

const addCertification = {
  type: certification,
  description: "Add a certification",
  args: {
    platform: { type: GraphQLString },
    programme: { type: GraphQLNonNull(GraphQLString) },
    period: { type: GraphQLNonNull(GraphQLString) },
    certificate: { type: GraphQLNonNull(GraphQLString) },
    certification: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { programme, period, certificate, certification } = args;

    const certArr = [programme, period, certificate, certification];

    const emptyArg = certArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await certificationModel.create({
      programme,
      period,
      certificate,
      certification,
    });

    const create = mutationConvertDate(result);

    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new certification, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteCertificationById = {
  type: certification,
  description: "Delete a certification by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await certificationModel.findByIdAndDelete(args.id);
    return mutationConvertDate(result);
  },
};

const updateCertificationById = {
  type: certification,
  description: "Update a certification by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    programme: { type: GraphQLString },
    period: { type: GraphQLString },
    certificate: { type: GraphQLString },
    certification: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const updateRecord = Object.keys(args)
      .filter((key) => args[key] != null && args[key] !== "")
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: args[key] });
      }, {});

    const recordCount = Object.keys(updateRecord);

    if (recordCount.length < 2 || recordCount === null) {
      throw new GraphQLError(
        `No update data provided, Kindly provide atleast one data to update `
      );
    }

    const result = await certificationModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} on certification record, ` + JSON.stringify(err)
      );
    }
  },
};

const addHobby = {
  type: hobby,
  description: "Add a hobby",
  args: {
    platform: { type: GraphQLString },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const { name, description } = args;

    const hobbyArr = [name, description];

    const emptyArg = hobbyArr.filter((item) => item?.length < 1);

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const result = await hobbyModel.create({
      name,
      description,
    });

    const create = mutationConvertDate(result);

    if (create) {
      return create;
    } else {
      throw new GraphQLError(
        `Failed to create new hobby, ` + JSON.stringify(err)
      );
    }
  },
};

const deleteHobbyById = {
  type: hobby,
  description: "Delete a hobby by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const result = await hobby.findByIdAndDelete(args.id);
    return mutationConvertDate(result);
  },
};

const updateHobbyById = {
  type: hobby,
  description: "Update a hobby by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    platform: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  resolve: async (_, args, { req }) => {
    const platform = args.platform;
    console.log(platform);
    // Validating user Authorization Code
    await loginAuth(req, platform);
    const updateRecord = Object.keys(args)
      .filter((key) => args[key] != null && args[key] !== "")
      .reduce((cur, key) => {
        return Object.assign(cur, { [key]: args[key] });
      }, {});

    const recordCount = Object.keys(updateRecord);

    if (recordCount.length < 2 || recordCount === null) {
      throw new GraphQLError(
        `No update data provided, Kindly provide atleast one data to update `
      );
    }

    const result = await hobby.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );

    const runUpdate = mutationConvertDate(result);

    if (runUpdate) {
      return runUpdate;
    } else {
      throw new GraphQLError(
        `Failed to update ${id} on hobby record, ` + JSON.stringify(err)
      );
    }
  },
};

module.exports = {
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
};
