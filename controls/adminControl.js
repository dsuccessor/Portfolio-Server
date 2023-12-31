const adminModel = require("../models/usersModel");
const {
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
const userTable = new GraphQLObjectType({
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
      id,
      adminId,
      surname,
      otherName,
      email,
      password,
      passport,
      role,
      createdAt,
      updatedAt,
    } = item;

    const created = createdAt?.toLocaleDateString();
    const updated = updatedAt?.toLocaleDateString();
    // const created = JSON.stringify(createdAt).split("T")[0];
    // const updated = JSON.stringify(updatedAt).split("T")[0];
    const newObj = {
      id,
      surname,
      otherName,
      email,
      password,
      passport,
      adminId,
      role,
      createdAt: created,
      updatedAt: updated,
    };
    return (newData = [...newData, newObj]);
  });
  return newData;
};

//Admin Table fetch queries
const getAdminByEmail = {
  type: GraphQLList(userTable),
  description: "Fetch admin by email address",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const result = await adminModel.find({ email: args.email });

    if (result) {
      return result;
    } else {
      throw new GraphQLError("Error Occured, Unable to fetch admin", {
        errors,
      });
    }
  },
};
const getAdminById = {
  type: userTable,
  description: "Fetch admin by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, args) => {
    return adminModel.findById(args.id);
  },
};
const getAdmins = {
  type: GraphQLList(userTable),
  description: "Fetch all admins",
  resolve: async (parent, args) => {
    const result = await adminModel.find();
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
};

//Admin Table mutationa queries
const addAdmin = {
  type: userTable,
  description: "Add an admin",
  args: {
    surname: { type: GraphQLNonNull(GraphQLString) },
    otherName: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    passport: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: {
      type: new GraphQLEnumType({
        name: "addRole",
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
      role: args.role,
    };

    const { surname, otherName, email, passport, password, role } = args;

    const adminArr = [surname, otherName, email, passport, password, role];

    const emptyArg = adminArr.filter((item) => item === "");

    if (emptyArg.length > 0) {
      throw new GraphQLError(
        `${emptyArg.length} empty field(s), Kindly provide the missing value(s)`
      );
    }

    const checkIfExist = await adminModel.findOne({ email });
    if (checkIfExist) {
      throw new GraphQLError(`User with ${email} already exist`);
    } else {
      const create = await adminModel.create({
        surname,
        otherName,
        email,
        passport,
        password,
        role,
      });
      if (create) {
        return create;
      } else {
        throw new GraphQLError(`Registeration failed, ` + JSON.stringify(err));
      }
    }
  },
};
const deleteAdminById = {
  type: userTable,
  description: "Delete an admin by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, args) => {
    return adminModel.findByIdAndDelete(args.id);
  },
};
const updateAdminById = {
  type: userTable,
  description: "Update an admin by Id",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: {
      type: new GraphQLEnumType({
        name: "updateRole",
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
      role: args.role,
    };

    return adminModel.findByIdAndUpdate(
      args.id,
      {
        $set: updateRecord,
      },
      { new: true }
    );
  },
};

module.exports = {
  getAdminByEmail,
  getAdminById,
  getAdmins,
  addAdmin,
  deleteAdminById,
  updateAdminById,
};
