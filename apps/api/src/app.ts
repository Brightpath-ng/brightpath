import cors from "cors";
import express, { type Express } from "express";

const allowedOrigins = [process.env.MARKETING_ORIGIN, process.env.WEB_ORIGIN].filter(
  (origin): origin is string => Boolean(origin)
);

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
}
