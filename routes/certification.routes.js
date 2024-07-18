import { Router } from "express";
import {
    addCertification,
    getCertification,
    getAllCertifications,
    getCertificationsByUserId,
    getCertifiedUsersByCertificateId,
    updateCertification,
    deleteCertification,
    restoreCertification
} from "../controllers/certification.controllers.js";

const certificationRouter = Router();

certificationRouter.get("/:id", getCertification);
certificationRouter.get("/", getAllCertifications);
certificationRouter.post("/", addCertification);
certificationRouter.get("/users/:userId", getCertificationsByUserId);
certificationRouter.get("/certificates/:certificateId", getCertifiedUsersByCertificateId);
certificationRouter.patch("/:id", updateCertification);
certificationRouter.delete("/:id", deleteCertification);
certificationRouter.patch("/:id/restore", restoreCertification);

export default certificationRouter;
