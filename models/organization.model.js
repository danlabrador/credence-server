import { Schema, model } from "mongoose";
import { ulid } from "ulid";

const organizationSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => ulid(),
    },
    name: {
      type: String,
      required: [true, "Organization name is required."],
    },
    description: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    logo: {
      path: {
        type: String,
        default: '',
      },
      filename: {
        type: String,
        default: '',
      },
    },
    website: {
      type: String,
      default: '',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Organization = model("Organization", organizationSchema);
export default Organization;