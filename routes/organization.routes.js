import { Router } from "express";
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  restoreOrganization,
  getOrganizationMembers,
  assignMemberToOrganization,
  updateLogo
} from "../controllers/organization.controllers.js";

import multer from "multer";
import { organizationStorage } from "../config/storage.js";


const organizationRouter = Router();
const logo = multer({ storage: organizationStorage });

organizationRouter.post("/", createOrganization);
organizationRouter.get("/", getAllOrganizations);
organizationRouter.get("/:id", getOrganizationById);
organizationRouter.patch("/:id", updateOrganization);
organizationRouter.patch(
  "/:id/logo",
  logo.single("logo"),
  updateLogo
);
organizationRouter.delete("/:id", deleteOrganization);
organizationRouter.patch("/:id/restore", restoreOrganization);
organizationRouter.get("/:id/members", getOrganizationMembers);
organizationRouter.post("/:id/members/:userId", assignMemberToOrganization);

export default organizationRouter;