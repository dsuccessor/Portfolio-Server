const cvModel = require("../models/cvModel");
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
} = require("graphql");

// Admin Table
const adminTable = new GraphQLObjectType({
  name: "admin",
  description: "admin Table",
  fields: () => ({
    id: { type: GraphQLID },
    adminId: { type: GraphQLInt },
    surname: { type: GraphQLString },
    otherName: { type: GraphQLString },
    email: { type: GraphQLString },
    passport: { type: GraphQLString },
    password: { type: GraphQLString },
    adminType: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    message: {
      type: GraphQLString,
      resolve: (admin) => {
        console.log(admin);
        return admin.userId != null ? "Success" : "Failed";
      },
    },
  }),
});

const errorTable = new GraphQLObjectType({
  name: "serverError",
  description: "Error response table",
  fields: () => ({
    path: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

const convertDate = (data) => {
  let newData = [];
  data.map((item) => {
    const {
      id,
      surname,
      otherName,
      email,
      password,
      passport,
      adminId,
      adminType,
      createdAt,
      updatedAt,
    } = item;
    const created = JSON.stringify(createdAt).split("T")[0];
    const updated = JSON.stringify(updatedAt).split("T")[0];
    const newObj = {
      id,
      surname,
      otherName,
      email,
      password,
      passport,
      adminId,
      adminType,
      createdAt: created,
      updatedAt: updated,
    };
    return (newData = [...newData, newObj]);
  });
  return newData;
};

//DB SchoolPortal Fetch queries
const fetchAdmin = new GraphQLObjectType({
  name: "getSchoolPortalDb",
  description: "Fetch from School Portal Database",
  fields: () => ({
    getAdminByEmail: {
      type: GraphQLList(adminTable),
      description: "Fetch admin by email address",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const result = await cvModel.find({ email: args.email });

        if (result) {
          return result;
        } else {
          throw new GraphQLError("Error Occured, Unable to fetch admin", {
            errors,
          });
        }
      },
    },
    getAdminById: {
      type: adminTable,
      description: "Fetch admin by Id",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        return cvModel.findById(args.id);
      },
    },
    getAdmins: {
      type: GraphQLList(adminTable),
      description: "Fetch all admins",
      resolve: async (parent, args) => {
        const result = await cvModel.find();
        const serverResponse = convertDate(result);
        console.log(serverResponse);
        if (result.length > 0) {
          return serverResponse;
        } else if (result === 0) {
          throw new GraphQLError("No record found for Admins");
        } else {
          throw new GraphQLError({
            errors,
          });
        }
      },
    },
  }),
});

//Queries POST made on CV DB
const postAdmin = new GraphQLObjectType({
  name: "addToSchoolPortalDB",
  description: "Add data to school portal database",
  fields: () => ({
    addAdmin: {
      type: adminTable,
      description: "Add an admin",
      args: {
        surname: { type: GraphQLNonNull(GraphQLString) },
        otherName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        passport: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        adminType: {
          type: new GraphQLEnumType({
            name: "addAdminType",
            values: {
              superAdmin: { value: "Super Admin" },
              admin: { value: "Admin" },
            },
          }),
          defaultValue: "Admin",
        },
      },
      resolve: async (parent, args) => {
        const adminRecord = {
          surname: args.surname,
          otherName: args.otherName,
          email: args.email,
          passport: args.passport,
          password: args.password,
          adminType: args.adminType,
        };

        const { surname, otherName, email, passport, password, adminType } =
          args;

        const adminArr = [
          surname,
          otherName,
          email,
          passport,
          password,
          adminType,
        ];

        const emptyArg = adminArr.filter((item) => item === "");

        if (emptyArg.length > 0) {
          throw new GraphQLError(
            `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
          );
        }

        const checkIfExist = await cvModel.findOne({ email });
        if (checkIfExist) {
          throw new GraphQLError(`User with ${email} already exist`);
        } else {
          const create = await cvModel.create({
            surname,
            otherName,
            email,
            passport,
            password,
            adminType,
          });
          if (create) {
            return create;
          } else {
            throw new GraphQLError(
              `Registeration failed, ` + JSON.stringify(err)
            );
          }
        }
      },
    },
    deleteAdminById: {
      type: adminTable,
      description: "Delete an admin by Id",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        return cvModel.findByIdAndDelete(args.id);
      },
    },
    updateAdminById: {
      type: adminTable,
      description: "Update an admin by Id",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        adminType: {
          type: new GraphQLEnumType({
            name: "updateAdminType",
            values: {
              superAdmin: { value: "Super Admin" },
              admin: { value: "Admin" },
            },
          }),
          defaultValue: "Admin",
        },
      },
      resolve: (parent, args) => {
        const updateRecord = {
          email: args.email,
          password: args.password,
          adminType: args.adminType,
        };

        return cvModel.findByIdAndUpdate(
          args.id,
          {
            $set: updateRecord,
          },
          { new: true }
        );
      },
    },
  }),
});

module.exports = {
  fetchAdmin,
  postAdmin,
};
