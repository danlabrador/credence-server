import Certification from "../models/certification.model.js";
import User from "../models/user.model.js";
import Certificate from "../models/certificate.model.js";
import { validateCertificationData, baseSchema, certificationSchema } from "../validations/certification.validation.js";

// Custom ULID validation function using regex
const isValidUlid = (id) => /^[0-9A-HJKMNP-TV-Z]{26}$/.test(id);

// Award certification to a user
const addCertification = async (req, res) => {
  try {
    const certificationData = req.body;
    const bodyValidationError = validateCertificationData(certificationData, certificationSchema);
    if (bodyValidationError) {
      return res.status(400).send({ message: bodyValidationError });
    }

    const {
      userId,
      certificateId,
      grade,
      isPublic
    } = certificationData;

    const certificationExists = await Certification.exists({
      userId,
      certificateId
    });

    if (certificationExists) {
      return res.status(409).json({ message: "Certification already exists." });
    }

    // Fetch user details including first name, middle name, and last name
    const user = await User.findOne({ _id: userId, deletedAt: null });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch certificate details including certificate name
    const certificate = await Certificate.findOne({ _id: certificateId, deletedAt: null });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }

    const newCertification = new Certification({
      userId,
      certificateId,
      grade,
      isPublic: true,
      issuedAt: new Date()
    });

    await newCertification.save();

    return res.status(201).send({
      message: "Certification awarded to user successfully.",
      data: {
        userId: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        certificationId: newCertification._id,
        certificateId: certificate._id,
        certificateName: certificate.certificateName,
        grade: newCertification.grade,
        isPublic: newCertification.isPublic
      },
    });
  } catch (error) {
    console.error("Error awarding certification:", error);
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};

const getCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateCertificationData({ id }, baseSchema);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const rawCertification = await Certification.findOne({ _id: id, deletedAt: null })
      .populate("userId", "firstName lastName email profilePic")
      .populate("certificateId", "name description criteria imageUrl skills");

    if (!rawCertification) {
      return res.status(404).json({ message: "Certification not found." });
    }

    // Convert the raw data to a plain object
    const certification = rawCertification.toObject();
    certification.certificate = rawCertification.certificateId;
    delete certification.certificateId;
    certification.user = rawCertification.userId;
    delete certification.userId;

    return res.status(200).json({
      message: "Certification found.",
      data: certification,
    });
  } catch (error) {
    console.error("Error fetching certification: ", error);
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
}

// View awarded certifications
const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find()
      .populate("userId", "firstName lastName email")
      .populate("certificateId", "name description");
    return res.status(200).json({
      message: "Certifications found.",
      data: certifications
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};

// View awarded certifications for a specific user
const getCertificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const validationError = validateCertificationData({ userId }, baseSchema);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const rawCertifications = await Certification.find({ userId, deletedAt: null }).populate(
      "certificateId",
      "name description"
    );

    const certifications = rawCertifications.map(cert => {
      const certObj = cert.toObject(); //
      certObj.certificate = certObj.certificateId;
      delete certObj.certificateId;
      return certObj;
    });

    if (certifications.length < 1) {
      return res.status(200).json({
        message: "No certifications found for this user.",
        data: []
      })
    }

    return res.status(200).json({
      message: "Certifications found.",
      data: certifications,
    });
  } catch (error) {
    console.log("Error fetching certifications: ", error.message)
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};


const getCertifiedUsersByCertificateId = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const validationError = validateCertificationData({ certificateId }, baseSchema);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const certifications = await Certification.find({ certificateId, deletedAt: null }).populate(
      "userId",
      "firstName lastName email"
    );

    if (certifications.length < 1) {
      return res.status(404).json({ message: "Certifications not found." });
    }

    return res.status(200).json({
      message: "Certifications found.",
      data: certifications,
    });
  } catch (error) {
    console.log("Error fetching certifications: ", error.message)
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
}


// Update certification details
const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const certificationData = req.body;
    const validationError = validateCertificationData({
      ...certificationData,
      id
    }, baseSchema);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Retrieve the current document
    const currentCertification = await Certification.findOne({ _id: id, deletedAt: null });
    if (!currentCertification) {
      return res.status(404).send({ message: 'Certification not found or has been deleted.' });
    }

    // Proceed with update if validation passes
    const updatedCertification = await Certification.findOneAndUpdate(
      { _id: id, deletedAt: null },
      certificationData,
      { new: true }
    );

    return res.status(200).json({
      message: "Certification updated successfully.",
      data: updatedCertification,
    });
  } catch (error) {
    console.log("Error updating certification: ", error.message)
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};

// Remove certification (soft delete)
const deleteCertification = async (req, res) => {

  try {
    const { id } = req.params;

    const validationError = validateCertificationData({ id }, baseSchema);
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const deletedCertification = await Certification.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedCertification) {
      return res.status(404).send({ message: "Certification not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.log("Error deleting certification: ", error.message)
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const restoreCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateCertificationData({ id }, baseSchema);
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const certification = await Certification.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    );

    if (!certification) {
      return res.status(404).send({ message: "Certification not found." });
    }

    return res.status(200).send({
      message: "Certification has been restored.",
      data: certification
    });

  } catch (error) {
    console.error("Error in restoring certificate: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
}


export {
  addCertification,
  getCertification,
  getAllCertifications,
  getCertificationsByUserId,
  getCertifiedUsersByCertificateId,
  updateCertification,
  deleteCertification,
  restoreCertification
};
