import express from "express";
import cors from "cors";
import helmet from "helmet";
import {pinoHttp} from "pino-http";
import logger from "./lib/logger.js";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

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


app.use("/api", routes);
app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);

export default app;