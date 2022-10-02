import express from "express";

import * as categoriesController from "../controllers/categories.controller.js";
import * as gamesController from "../controllers/games.controller.js";
import * as customersController from "../controllers/customers.controller.js";

const router = express.Router();

router.post("/categories", categoriesController.RegisterNewCategory);
router.get("/categories", categoriesController.GetCategories);

router.post("/games", gamesController.RegisterNewGame);
router.get("/games", gamesController.GetGames);

router.get("/customers", customersController.GetCustomers);

export default router;
