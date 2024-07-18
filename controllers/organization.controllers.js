import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";
import { baseSchema, createOrganizationSchema, validateOrganizationData } from "../validations/organization.validation.js";
import { baseSchema as userSchema } from "../validations/user.validation.js";

const createOrganization = async (req, res) => {
  try {
    const organizationData = req.body;
    const bodyValidationError = validateOrganizationData(organizationData, createOrganizationSchema);
    if (bodyValidationError) {
      return res.status(400).json({ message: bodyValidationError });
    }

    const {
      name,
      description,
      email,
      website
    } = organizationData;

    const doesOrganizationExists = await Organization.exists({ email });
    if (doesOrganizationExists) {
      return res.status(409).json({ message: "Organization already exists. You can restore organization data if deleted." });
    }

    const newOrganization = new Organization({
      name,
      description,
      email,
      website
    });

    await newOrganization.save();

    res.status(201).send({
      message: "Organization created successfully.",
      data: newOrganization,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};


const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ deletedAt: null });
    return res.status(200).json({
      message: "List of organizations found.",
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};


//Get organization by ID
const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateOrganizationData({ id }, baseSchema);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const organization = await Organization.findOne({ _id: id, deletedAt: null });
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    return res.status(200).json({
      message: "Organization found.",
      data: organization,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};


const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const idValidationError = validateOrganizationData({ id }, baseSchema);
    if (idValidationError) {
      return res.status(400).json({ message: idValidationError });
    }

    const organizationData = req.body;
    const bodyValidationError = validateOrganizationData(organizationData, baseSchema);
    if (bodyValidationError) {
      return res.status(400).json({ message: bodyValidationError });
    }


    const updatedOrganization = await Organization.findOneAndUpdate(
      { _id: id, deletedAt: null },
      organizationData,
      { new: true, runValidators: true }
    );

    if (!updatedOrganization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    return res.json({
      message: "Organization updated successfully.",
      data: updatedOrganization,
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });

  }
};


const updateLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { path, filename } = req.file;

    console.log(req.file)

    const idValidationError = validateOrganizationData({ id }, baseSchema);
    if (idValidationError) {
      return res.status(400).json({ message: idValidationError });
    }

    const updatedOrganization = await Organization.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { logo: { path, filename } },
      { new: true }
    );

    return res.status(200).send({
      message: "Logo updated successfully.",
      data: updatedOrganization,
    });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}


const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationError = validateOrganizationData({ id }, baseSchema);
    if (idValidationError) {
      return res.status(400).json({ message: idValidationError });
    }

    const deletedOrganization = await Organization.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedOrganization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error in deleting organization account: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};



const restoreOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateOrganizationData({ id }, baseSchema);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const organization = await Organization.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    );

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    return res.status(200).json({
      message: "Organization restored successfully.",
      data: organization,
    });
  } catch (error) {
    console.error("Error restoring organization: ", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}


//Get Organization Details by Organization ID
const getOrganizationMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationError = validateOrganizationData({ id }, baseSchema);
    if (idValidationError) {
      return res.status(400).json({ message: idValidationError });
    }

    // Find the organization by ID
    const organization = await Organization.findOne({ _id: id, deletedAt: null });

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    const rawMembers = await User.find({ organizationId: id, deletedAt: null });

    // Check if members exist
    const members = rawMembers.map(member => ({
      id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email
    }))

    return res.status(200).json({
      message: 'Organization details found.',
      data: {
        id: organization._id,
        name: organization.name,
        description: organization.description,
        members: members
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//Assign Member to Organization
const assignMemberToOrganization = async (req, res) => {
  try {
    const { id: organizationId, userId } = req.params;

    const organizationIdValidationError = validateOrganizationData({ id: organizationId }, baseSchema);
    if (organizationIdValidationError) {
      return res.status(400).json({ message: organizationIdValidationError });
    }

    const userIdValidationError = validateOrganizationData({ id: userId }, userSchema);
    if (userIdValidationError) {
      return res.status(400).json({ message: userIdValidationError });
    }

    const organization = await Organization.findOne({ _id: organizationId, deletedAt: null });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    // Check if user (member) exists and is not deleted
    const user = await User.findOne({ _id: userId, deletedAt: null });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user is already a member of the organization
    if (user.organizationId === organizationId) {
      return res.status(400).json({ message: 'User is already a member of this organization.' });
    }

    console.log(userId);
    console.log(organizationId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organizationId },
      { new: true }
    );

    return res.status(200).json({
      message: 'User assigned to organization successfully.',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  updateLogo,
  deleteOrganization,
  restoreOrganization,
  getOrganizationMembers,
  assignMemberToOrganization
};