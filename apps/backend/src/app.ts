import express from "express";
import cors from "cors";
import helmet from "helmet";
import {pinoHttp} from "pino-http";
import logger from "./lib/logger.js";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import { API_BASE } from "./config/constants.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import { AUTH_CONSTANTS } from "./shared/constants/auth.js";
import { env } from "./config/env.js";
import { HTTP_STATUS } from "./shared/constants/http.js";
import userRoutes from "./users/user.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


app.use(
  pinoHttp({
    logger,
  })
);

app.use(API_BASE, routes);

app.use("/api/v1/users", userRoutes);

app.use(notFound);
app.use(errorHandler);


export default app;