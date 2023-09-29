const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");
// autoIncrement.initialize(mongoose.connection);

const languageSchema = new mongoose.Schema(
  {
    // languageId: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const projectSchema = new mongoose.Schema(
  {
    // projectId: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
    },
    flyer: {
      type: String,
      required: true,
      unique: false,
    },
    technologies: [
      {
        type: String,
        required: true,
        unique: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const skillSchema = new mongoose.Schema(
  {
    // skillId: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const mediaSchema = new mongoose.Schema(
  {
    // mediaId: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    handle: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    logo: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// languageSchema.plugin(autoIncrement.plugin, {
//   model: "language",
//   field: "languageId",
//   startAt: 10001,
//   incrementBy: 1,
// });

// projectSchema.plugin(autoIncrement.plugin, {
//   model: "project",
//   field: "projectId",
//   startAt: 10001,
//   incrementBy: 1,
// });

// skillSchema.plugin(autoIncrement.plugin, {
//   model: "skill",
//   field: "skillId",
//   startAt: 10001,
//   incrementBy: 1,
// });

// mediaSchema.plugin(autoIncrement.plugin, {
//   model: "media",
//   field: "mediaId",
//   startAt: 10001,
//   incrementBy: 1,
// });

const languageModel = mongoose.model("language", languageSchema);
const projectModel = mongoose.model("project", projectSchema);
const skillModel = mongoose.model("skill", skillSchema);
const mediaModel = mongoose.model("media", mediaSchema);

module.exports = { languageModel, projectModel, skillModel, mediaModel };
