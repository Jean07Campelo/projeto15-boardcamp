import express from "express";

import * as categoriesController from "../controllers/categories.controller.js";
import * as gamesController from "../controllers/games.controller.js";
import * as customersController from "../controllers/customers.controller.js";
import * as rentalsController from "../controllers/rentals.controller.js";

const router = express.Router();

router.post("/categories", categoriesController.RegisterNewCategory);
router.get("/categories", categoriesController.GetCategories);

router.post("/games", gamesController.RegisterNewGame);
router.get("/games", gamesController.GetGames);

router.get("/customers", customersController.GetCustomers);
router.post("/customers", customersController.RegisterNewClient);
router.get("/customers/:id", customersController.GetClientByID);
router.put("/customers/:id", customersController.UpdateClientById);

router.post("/rentals", rentalsController.RegisterRental);

export default router;
