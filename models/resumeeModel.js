const mongoose = require("mongoose");

const objectiveSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    summary: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    logo: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    period: {
      type: String,
      required: true,
      lowercase: true,
    },
    qualification: {
      type: String,
      required: true,
      lowercase: true,
    },
    course: {
      type: String,
      required: true,
      lowercase: true,
    },
    grade: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const experienceSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      lowercase: true,
    },
    position: {
      type: String,
      required: true,
      lowercase: true,
    },
    period: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const awardSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      lowercase: true,
    },
    award: {
      type: String,
      required: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const certificationSchema = new mongoose.Schema(
  {
    programme: {
      type: String,
      required: true,
      lowercase: true,
    },
    period: {
      type: String,
      required: true,
      lowercase: true,
    },
    certificate: {
      type: String,
      required: true,
    },
    certification: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const hobbySchema = new mongoose.Schema(
  {
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
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const cvlanguageSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["fluent", "basic"],
      default: "fluent",
    },
  },
  {
    timestamps: true,
  }
);

const objectiveModel = mongoose.model("objective", objectiveSchema);
const educationModel = mongoose.model("education", educationSchema);
const experienceModel = mongoose.model("experience", experienceSchema);
const awardModel = mongoose.model("award", awardSchema);
const certificationModel = mongoose.model("certification", certificationSchema);
const hobbyModel = mongoose.model("hobby", hobbySchema);
const cvlanguageModel = mongoose.model("cvlanguage", cvlanguageSchema);

module.exports = {
  objectiveModel,
  educationModel,
  experienceModel,
  awardModel,
  certificationModel,
  hobbyModel,
  cvlanguageModel,
};
