import express from "express";
import users from "./routes/Users.js";
import products from "./routes/Products.js";
import logger from "./Middleware/logger.js";
import notFoundHandler from "./Middleware/notFound.js";
import errorHandler from "./Middleware/ErrorHandler.js";
import cors from "cors";

const app = express();
const port = process.env.port || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

app.use("/api/users", users);
app.use("/api/products", products);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(port);
});
