import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} from "../Controllers/ProductController.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.post("/", createProduct);

router.put("/", updateProduct);

router.delete("/:id", deleteProduct);
export default router;
