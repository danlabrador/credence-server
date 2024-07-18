import { Schema, model } from "mongoose";
import { ulid } from "ulid";

const certificationSchema = new Schema({
  _id: {
    type: String,
    default: () => ulid(),
  },
  userId: {
    type: String,
    ref: "User",
    required: [true, "User ID is required"],
    validate: {
      validator: function (v) {
        return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(v);
      },
      message: props => `${props.value} is not a valid ULID`
    }
  },
  certificateId: {
    type: String,
    ref: "Certificate",
    validate: {
      validator: function (v) {
        return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(v);
      },
      message: props => `${props.value} is not a valid ULID`
    }
  },
  grade: {
    type: Number,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  expiredAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const Certification = model("Certification", certificationSchema);

export default Certification;
