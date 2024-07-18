import { Schema, model } from "mongoose";
import { ulid } from "ulid";
import slugify from "slugify";
import rolesEnum from "../enums/roleTypes.enum.js";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => ulid(),
    },
    firstName: {
      type: String,
      default: null,
    },
    middleName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email field is required."],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password field is required."],
    },
    currentEmployer: {
      type: String,
      default: null,
    },
    currentPosition: {
      type: String,
      default: null,
    },
    birthYear: {
      type: Number,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
    },
    websiteUrl: {
      type: String,
      default: null,
    },
    fbUrl: {
      type: String,
      default: null,
    },
    linkedinUrl: {
      type: String,
      default: null,
    },
    xUrl: {
      type: String,
      default: null,
    },
    profilePic: {
      path: {
        type: String,
        default: null,
      },
      filename: {
        type: String,
        default: null,
      },
    },
    organizationId: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    vanitySlug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: [rolesEnum.admin.name, rolesEnum.professional.name],
      required: [true, "Role field is required."],
      default: rolesEnum.professional.name,
    },
    deletedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
