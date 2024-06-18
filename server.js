import express from "express";
import users from "./routes/Users.js";
import products from "./routes/Products.js";
import logger from "./Middleware/logger.js";
import notFoundHandler from "./Middleware/notFound.js";
import errorHandler from "./Middleware/ErrorHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import colors from "colors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.dirName = __dirname;

console.log(global.dirName);

const app = express();
const port = process.env.port || 8000;

app.use(express.static("assets"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

app.use("/api/users", users);
app.use("/api/products", products);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running at port ${port}`["brightMagenta"]);
});
