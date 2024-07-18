import Certificate from "../models/certificate.model.js";
import { validateCertificateData } from "../validations/certificate.validation.js";

const addCertificate = async (req, res) => {
  try {
    const certificateData = req.body;
    const validationError = validateCertificateData(certificateData, "addCertificateSchema");
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const newCertificate = new Certificate(certificateData);

    await newCertificate.save();

    return res.status(201).send({
      message: "Certificate has been created.",
      data: newCertificate
    });
  } catch (error) {
    console.error("Error adding certificate: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};


const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateCertificateData({ id }, "getCertificateSchema");
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const certificate = await Certificate.findOne({ _id: id, deletedAt: null });

    if (!certificate) {
      return res.status(404).send({ message: "Certificate not found." });
    }

    const responseCertificate = { ...certificate.toObject() };

    return res.status(200).send(responseCertificate);
  } catch (error) {
    console.error("Error retrieving certificate: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};


const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificateData = req.body;

    const idValidationError = validateCertificateData({ id }, "getCertificateSchema");
    if (idValidationError) {
      return res.status(400).send({ message: idValidationError });
    }

    const bodyValidationError = validateCertificateData(certificateData);
    if (bodyValidationError) {
      return res.status(400).send({ message: bodyValidationError });
    }

    const updatedCertificate = await Certificate.findOneAndUpdate(
      { _id: id, deletedAt: null },
      certificateData,
      { new: true, runValidators: true }
    );

    if (!updatedCertificate) {
      return res.status(404).send({ message: "Certificate not found." });
    }

    return res.status(200).send({
      message: "Certificate has been updated.",
      data: updatedCertificate
    });
  } catch (error) {
    console.error("Error updating certificate: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};

const updateCertificateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { path, filename } = req.file;

    const validationError = validateCertificateData({ id }, "getCertificateSchema");
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const updatedCertificate = await Certificate.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { image: { path, filename } },
      { new: true }
    );

    if (!updatedCertificate) {
      return res.status(404).send({ message: "Certificate not found." });
    }

    return res.status(200).send({
      message: "Certificate picture has been updated.",
      data: updatedCertificate
    });
  } catch (error) {
    console.error("Error updating certificate picture: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
}


const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateCertificateData({ id }, "getCertificateSchema");
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const removedCertificate = await Certificate.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );

    if (!removedCertificate) {
      return res.status(404).send({ message: "Certificate not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting certificate: ", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};


const restoreCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateCertificateData({ id }, "getCertificateSchema");
    if (validationError) {
      return res.status(400).send({ message: validationError });
    }

    const certificate = await Certificate.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).send({ message: "Certificate not found." });
    }

    return res.status(200).send({
      message: "Certificate has been restored.",
    });

  } catch (error) {
    console.error("Error in restoring certificate: ", error);
    return res.status(500).send({ message: "Internal Server Error." });
  }
}

export { addCertificate, getCertificate, updateCertificate, updateCertificateImage, deleteCertificate, restoreCertificate };
