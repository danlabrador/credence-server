import User from "../models/user.model.js";
import { validateUserData, userSchema, loginSchema, updateUserSchema, getUserSchema, getUserByIdSchema } from '../validations/user.validation.js';
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const userData = req.body;

  const validationError = validateUserData(userData, userSchema);
  if (validationError) {
    return res.status(400).send({ message: validationError });
  }

  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      currentEmployer,
      currentPosition,
      birthYear,
      country,
      city,
      zipCode,
      bio,
      websiteUrl,
      fbUrl,
      linkedinUrl,
      xUrl,
      profilePic,
      vanitySlug
    } = userData;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(409).send({ message: "Email already exist." });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hash,
      currentEmployer,
      currentPosition,
      birthYear,
      country,
      city,
      zipCode,
      bio,
      websiteUrl,
      fbUrl,
      linkedinUrl,
      xUrl,
      profilePic,
      lastLogin: null,
      vanitySlug
    });
    await newUser.save();

    // Create a safe user object to send back (excluding sensitive fields)
    const safeUserData = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      lastLogin: newUser.lastLogin,
    };

    return res.status(201).send({
      message: "User has been created.",
      data: safeUserData,
    });

  } catch (error) {
    console.error("Error registering user: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const validationError = validateUserData({ email, password }, loginSchema);
  if (validationError) {
    return res.status(400).send({ message: validationError });
  }

  try {
    const user = await User.findOne({ email, deletedAt: null });

    if (!user) {
      return res.status(401).send({ message: "Incorrect email or password." });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Incorrect email or password." });
    }

    // Update last login date
    user.lastLogin = new Date();
    await user.save();

    // Create a safe user object to send back (excluding sensitive fields)
    const safeUserData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      lastLogin: user.lastLogin,
      profilePic: user.profilePic,
    };

    return res.status(200).send({
      message: "Login successful.",
      data: safeUserData,
    });


  } catch (error) {
    console.error("Error logging in user: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  try {
    // Validate user ID
    const { error } = getUserByIdSchema.validate({ id });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    if (Object.keys(userData).length === 0) {
      return res.status(400).send({ message: "No fields to update." });
    }

    const validationError = validateUserData(userData, updateUserSchema);
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await User.findOneAndUpdate(
      { _id: id, deletedAt: null },
      userData,
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Create a safe user object to send back (excluding sensitive fields)
    const safeUserData = {
      _id: user._id,
      vanitySlug: user.vanitySlug,
      ...userData, // Include updated fields
    };

    return res.status(200).send({
      message: "User account has been updated.",
      data: safeUserData,
    });

  } catch (error) {
    console.error("Error updating user: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { path, filename } = req.file;

    // Validate user ID
    const { error } = getUserByIdSchema.validate({ id });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { profilePic: { path, filename } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Create a safe user object to send back (excluding sensitive fields)
    const safeUserData = {
      _id: user._id,
      profilePic: { path, filename },
    };

    return res.status(200).send({
      message: "Profile picture updated successfully.",
      data: safeUserData,
    });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate user ID
    const { error } = getUserByIdSchema.validate({ id });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Find user by ID
    const user = await User.findOne({ _id: id, deletedAt: null });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Create a safe user object to send back (excluding sensitive fields)
    const safeUserData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthYear: user.birthYear,
      country: user.country,
      city: user.city,
      zipCode: user.zipCode,
      bio: user.bio,
      currentEmployer: user.currentEmployer,
      currentPosition: user.currentPosition,
      websiteUrl: user.websiteUrl,
      fbUrl: user.fbUrl,
      linkedinUrl: user.linkedinUrl,
      xUrl: user.xUrl,
      profilePic: user.profilePic,
      lastLogin: user.lastLogin,
    };

    return res.status(200).send({
      message: "User details retrieved successfully.",
      data: safeUserData,
    });

  } catch (error) {
    console.error("Error retrieving user details: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};


const getUserId = async (req, res) => {
  const { identifier } = req.params;
  const isEmail = identifier.includes("@");

  if (isEmail) {
    const { error } = getUserSchema.validate({ email: identifier });
    if (error) return res.status(400).send({ message: error.details[0].message });
  } else {
    const { error } = getUserSchema.validate({ vanitySlug: identifier });
    if (error) return res.status(400).send({ message: error.details[0].message });
  }

  try {
    let user = isEmail ?
      await User.findOne({ email: identifier, deletedAt: null }) :
      await User.findOne({ vanitySlug: identifier, deletedAt: null });

    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json({
      message: "User found.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Failed to fetch user." });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate user ID
    const { error } = getUserByIdSchema.validate({ id });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Respond with a success message
    return res.status(204).send();

  } catch (error) {
    console.error("Error in deleting user account: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};


const restoreUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate user ID
    const { error } = getUserByIdSchema.validate({ id });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Respond with a success message
    return res.status(200).send({
      message: "User account has been restored.",
    });

  } catch (error) {
    console.error("Error in restoring user account: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }

}

export {
  registerUser,
  loginUser,
  updateUser,
  updateProfilePicture,
  getUser,
  getUserId,
  deleteUser,
  restoreUser,
};
