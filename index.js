import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import certificationRoutes from "./routes/certification.routes.js";

dotenv.config();

const app = express();
const baseURL = "/api/v1";

db();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(`${baseURL}/users`, userRoutes);
app.use(`${baseURL}/certificates`, certificateRoutes);
app.use(`${baseURL}/organizations`, organizationRoutes);
app.use(`${baseURL}/certifications`, certificationRoutes);

app.use("/", (req, res) => res.send({ app: "credence_app" }));

app.listen(process.env.PORT, () =>
   console.log(`Server is listening on port ${process.env.PORT}.`)
);
