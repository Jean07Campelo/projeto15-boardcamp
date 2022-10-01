import express from "express";

import * as categoriesController from "../controllers/categories.controller.js";

const router = express.Router();

router.post("/categories", categoriesController.RegisterNewCategory);
router.get("/categories", categoriesController.GetCategories);

export default router;
