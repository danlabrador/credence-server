import { Schema, model } from "mongoose";
import { ulid } from "ulid";

const certificateSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => ulid(),
    },
    name: {
      type: String,
      required: [true, "Name field is required."],
    },
    description: {
      type: String,
      default: null,
    },
    criteria: {
      type: [String],
      default: [],
    },
    image: {
      path: {
        type: String,
        default: null,
        validate: {
          validator: function (v) {
            if (v == null) {
              return true;
            }
            var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return urlRegex.test(v);
          },
          message: props => `${props.value} is not a valid URL.`
        }
      },
      filename: {
        type: String,
        default: null,
      },
    },
    skills: {
      type: [String],
      default: []
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Certificate = model("Certificate", certificateSchema);
export default Certificate;
