import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "credence/users",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});

const certificateStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "credence/certificates",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});

const organizationStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "credence/organizations",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});

export { cloudinary, userStorage, certificateStorage, organizationStorage };
