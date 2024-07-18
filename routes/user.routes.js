import { Router } from "express";
import { registerUser, loginUser, updateUser, getUser, deleteUser, restoreUser, getUserId, updateProfilePicture } from "../controllers/user.controllers.js";
import { generateUniqueSlug, checkVanitySlugUniqueness } from "../middlewares/vanitySlug.middleware.js";
import multer from "multer";
import { userStorage } from "../config/storage.js";

const userRouter = Router();
const profilePicture = multer({ storage: userStorage });

userRouter.post("/login", loginUser);
userRouter.get("/:id", getUser);
userRouter.get("/:identifier/id", getUserId);
userRouter.post("/register", generateUniqueSlug, registerUser);
userRouter.patch("/:id", checkVanitySlugUniqueness, updateUser);
userRouter.patch(
  "/:id/profile-picture",
  profilePicture.single("profile-picture"),
  updateProfilePicture
);
userRouter.patch("/restore/:id", restoreUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
