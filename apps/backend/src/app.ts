import express from "express";
import cors from "cors";
import helmet from "helmet";
import {pinoHttp} from "pino-http";
import logger from "./lib/logger.js";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import { API_BASE } from "./config/constants.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  pinoHttp({
    logger,
  })
);


app.use(API_BASE, routes);
app.use(notFound);
app.use(errorHandler);

export default app;