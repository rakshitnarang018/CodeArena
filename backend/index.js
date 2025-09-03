import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { Env } from "./config/env.config.js";
import { AsyncHandler } from "./middlewares/AsyncHandler.middleware.js";
import { HTTPSTATUS } from "./config/Https.config.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.middleware.js";

import DatabaseConnect from "./config/database.config.js";
import poolPromise from "./config/sql.config.js";

import { initializeUserTable } from "./controllers/user.controller.js";
import { initializeEventTable } from "./controllers/event.controller.js";
import { initializeTeamTable } from "./controllers/team.controller.js";

import UserRoute from "./routes/user.routes.js";
import EventRoute from "./routes/event.routes.js";
import TeamRoute from "./routes/team.routes.js";
import SubmissionRoute from "./routes/submission.routes.js";
import AnnouncementRoute from "./routes/announcement.routes.js";
import CertificateRoute from "./routes/certificate.routes.js";
import ChatQnARoute from "./routes/chatQna.routes.js";

const app = express();

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      Env.FRONTEND_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ===== Test Route =====
app.get(
  "/",
  AsyncHandler(async (req, res) => {
    const date = new Date();

    try {
      const pool = await poolPromise;

      const tablesQuery = `
        SELECT 
          TABLE_SCHEMA,
          TABLE_NAME,
          TABLE_TYPE
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_SCHEMA, TABLE_NAME
      `;

      const tablesResult = await pool.request().query(tablesQuery);

      const dbInfoQuery = `
        SELECT 
          DB_NAME() as DatabaseName,
          @@VERSION as SQLServerVersion,
          GETDATE() as CurrentTime
      `;

      const dbInfoResult = await pool.request().query(dbInfoQuery);

      res.status(HTTPSTATUS.OK).json({
        message: "Azure SQL Database Connection Test",
        status: "✅ Connected Successfully",
        date,
        databaseInfo: dbInfoResult.recordset[0],
        tables: {
          count: tablesResult.recordset.length,
          list: tablesResult.recordset,
        },
      });
    } catch (error) {
      console.error("Database connection test failed:", error);

      res.status(HTTPSTATUS.OK).json({
        message: "Azure SQL Database Connection Test",
        status: "❌ Connection Failed",
        date,
        error: {
          message: error.message,
          code: error.code || "Unknown",
        },
        fallback: "Hello World - Database connection unavailable",
      });
    }
  })
);

// ===== API Routes =====
const BASE_PATH = Env.BASE_PATH || "/api";
app.use(`${BASE_PATH}/v1/users`, UserRoute);
app.use(`${BASE_PATH}/v1/events`, EventRoute);
app.use(`${BASE_PATH}/v1/teams`, TeamRoute);
app.use(`${BASE_PATH}/v1/submissions`, SubmissionRoute);
app.use(`${BASE_PATH}/v1/announcements`, AnnouncementRoute);
app.use(`${BASE_PATH}/v1/certificates`, CertificateRoute);
app.use(`${BASE_PATH}/v1/chat`, ChatQnARoute);

// ===== Error Handler =====
app.use(ErrorHandler);

// ===== Initialize & Start Server =====
const initializeApp = async () => {
  try {
    await DatabaseConnect();
    await poolPromise;
    await initializeUserTable();
    await initializeTeamTable();
    await initializeEventTable();
    console.log(`Database connected in ${Env.NODE_ENV} mode.`);
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
};

const PORT = process.env.PORT || Env.PORT || 5000;

app.listen(PORT, async () => {
  await initializeApp();
  console.log(`🚀 Server is running on port ${PORT} in ${Env.NODE_ENV} mode`);
});

export default app;
