import db from "../Database/DB.js";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//@desc get all products
//@route GET /api/products/?page={}
export const getProducts = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const chunkSize = 2;
  const chunks = [];
  try {
    const results = await db.query(
      "SELECT `id`, `uid`, `product_name`, `description`, `rating`, `price`, `country`,imgPath FROM `products`"
    );
    const items = results[0];

    if (!isNaN(page)) {
      for (let i = 0; i < items.length; i += chunkSize) {
        let chunk = items.slice(i, i + chunkSize);
        chunks.push(chunk);
      }
      const response = {
        chunksCount: chunks.length,
        chunkIndex: page,
        chunk: chunks[page],
      };

      res.status(200).json(response || []);
      return;
    }
    res.status(200).json(items);
  } catch (e) {
    console.log(e);
    const error = new Error(e.code || e.message || "unknown error occured");
    next(error);
  }
};

//@desc get single product
//@route GET api/product/:id
export const getSingleProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const results = await db.query(`SELECT * FROM products WHERE uid=${id}`);
      res.status(200).json(results);
      return;
    }
    const error = new Error("invalid id format");
    error.status = 400;
    throw error;
  } catch (e) {
    const error = new Error(e.code || e.message || "unknown error occured");
    error.status = e.status;
    next(error);
  }
};

//@desc create a product
//@route POST api/products/
export const createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    if (
      body.uid &&
      body.name &&
      body.description &&
      !isNaN(body.rating) &&
      body.price &&
      body.country &&
      body.image
    ) {
      const matches = body.image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        const error = new Error("the base64 format is invalid");
        error.status = 400;
        throw error;
      }
      const mimeType = matches[1];
      const base64 = matches[2];
      const imgBuffer = Buffer.from(base64, "base64");
      const timeStamp = new Date().getTime();
      console.log(timeStamp);
      console.log(__dirname);
      const extension = mimeType.split("/")[1];
      const finalFileName = `${body.uid}-${timeStamp}.${extension}`;

      const requestDir = "/images";
      //creating the output directory
      const outPutDirectory = path.resolve(__dirname, "../assets" + requestDir);
      await fs.mkdir(outPutDirectory, { recursive: true });

      //define the path to save the image
      const filePath = path.join(outPutDirectory, finalFileName);
      await fs.writeFile(filePath, imgBuffer);

      //double check the image which is saved
      await fs.access(filePath, fs.constants.F_OK);

      const requestFileDir = requestDir + "/" + finalFileName;
      const results = await db.query(
        "INSERT INTO `products`(`uid`, `product_name`, `description`, `rating`, `price`, `country`,imgPath) VALUES (?,?,?,?,?,?,?)",
        [
          body.uid,
          body.name,
          body.description,
          body.rating,
          body.price,
          body.country,
          requestFileDir,
        ]
      );
      res.status(200).json(results);
      return;
    }
    const error = new Error("insufficent data to process the request");
    error.status = 400;
    throw error;
  } catch (e) {
    console.log(e);
    const error = new Error(e.code || e.message || "unknown error occured");
    error.status = e.status;
    next(error);
  }
};

//@desc update a product
//@route PUT api/products/
export const updateProduct = async (req, res, next) => {
  try {
    const body = req.body;
    if (
      body.id &&
      body.productName &&
      body.description &&
      body.reating &&
      body.price &&
      body.country
    ) {
      const results = await db.query(
        "UPDATE `products` SET `product_name`=?,`description`=?,`rating`=? ,`price`=? ,`country`=? WHERE `id`=?",
        [body.productName, body.description, body.reating, body.price, body.country, body.id]
      );
      res.status(200).json(results);
      return;
    }
    const error = new Error("insufficent data to process the request");
    error.status = 400;
    throw error;
  } catch (e) {
    const error = new Error(e.code || e.message || "unknown error occured");
    error.status = e.status;
    next(error);
  }
};

//@desc delete a product
//@route DELETE api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const results = await db.query(`DELETE FROM products WHERE id=${id}`);
      res.status(200).json(results);
      return;
    }
    const error = new Error("id is not in valid format");
    error.status = 400;
    throw error;
  } catch (e) {
    const error = new Error(e.code || e.message || "unknown error occured");
    error.status = e.status;
    next(error);
  }
};
