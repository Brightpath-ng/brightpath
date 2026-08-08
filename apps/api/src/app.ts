import cors from "cors";
import express, { type Express } from "express";
import { authRouter } from "./features/auth/routes.js";
import { tutorsRouter } from "./features/tutors/routes.js";
import { studentsRouter } from "./features/students/routes.js";
import { assignmentsRouter } from "./features/assignments/routes.js";

const allowedOrigins = [process.env.MARKETING_ORIGIN, process.env.WEB_ORIGIN].filter(
  (origin): origin is string => Boolean(origin)
);

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: allowedOrigins }));
  // Mounted before express.json() -- the webhook route needs the raw request
  // body for signature verification (see features/auth/routes.ts).
  app.use(authRouter);
  app.use(express.json());
  app.use(tutorsRouter);
  app.use(studentsRouter);
  app.use(assignmentsRouter);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
}
