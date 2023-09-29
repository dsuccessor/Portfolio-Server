const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const portfolioSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: Number,
      required: true,
      unique: true,
    },
    languages: [
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
    ],
    projects: [
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
        },
        flyer: {
          type: String,
          required: true,
          unique: true,
        },
        technologies: [
          {
            type: String,
            required: true,
            unique: true,
          },
          // {
          //   name: {
          //     type: String,
          //     required: true,
          //     lowercase: true,
          //     unique: true,
          //   },
          //   logo: {
          //     type: String,
          //     required: true,
          //     unique: true,
          //   },
          // },
        ],
      },
    ],
    skills: [
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
    ],
    medias: [
      {
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
        },
        logo: {
          type: String,
          required: true,
          unique: true,
        },
        link: {
          type: String,
          required: true,
          lowercase: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

portfolioSchema.plugin(autoIncrement.plugin, {
  model: "portfolio",
  field: "portfolioId",
  startAt: 10001,
  incrementBy: 1,
});

const portfolioModel = mongoose.model("portfolio", portfolioSchema);

module.exports = portfolioModel;
