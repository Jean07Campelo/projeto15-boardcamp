import express from "express";

import * as categoriesController from "../controllers/categories.controller.js";
import * as gamesController from "../controllers/games.controller.js";

const router = express.Router();

router.post("/categories", categoriesController.RegisterNewCategory);
router.get("/categories", categoriesController.GetCategories);

router.post("/games", gamesController.RegisterNewGame);

export default router;