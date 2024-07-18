import { Router } from "express";
import { addCertificate, getCertificate, updateCertificate, deleteCertificate, restoreCertificate, updateCertificateImage } from "../controllers/certificate.controllers.js";
import multer from "multer";
import { certificateStorage } from "../config/storage.js";

const certificateRouter = Router();

const image = multer({ storage: certificateStorage });

certificateRouter.get("/:id", getCertificate);
certificateRouter.post("/", addCertificate);
certificateRouter.patch("/:id", updateCertificate);
certificateRouter.patch("/:id/image", image.single("certificate-image"), updateCertificateImage);
certificateRouter.delete("/:id", deleteCertificate);
certificateRouter.patch("/:id/restore", restoreCertificate);

export default certificateRouter;
