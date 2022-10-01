import joi from "joi";
import connection from "../database.js";

const newGameSchema = joi.object({
  name: joi.string().required().empty(" "),
  image: joi.string().required().empty(" "),
  stockTotal: joi.number().required().positive(),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().required().positive(),
});

async function RegisterNewGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validationNewRegister = newGameSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationNewRegister.error) {
    const errors = validationNewRegister.error.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errors);
  }

  //validation if categoryId exists
  const idIsValid = await connection.query(
    "SELECT * FROM categories WHERE id = $1;",
    [categoryId]
  );

  if (idIsValid.rows.length === 0) {
    return res.status(400).send(`The id "${categoryId}" is invalid`);
  }

  //validation if name exists
  const nameGameIsRegistered = await connection.query(
    `SELECT * FROM games WHERE name = '${name}';`
  );

  if (nameGameIsRegistered.rows.length > 0) {
    return res.status(409).send(`Exists a game with name "${name}"`);
  }

  //register new game
  connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
    [name, image, stockTotal, categoryId, pricePerDay]
  );

  res.sendStatus(201);
};

async function GetGames(req, res) {
  const ListOfgames = await connection.query(
    `SELECT games.*, categories.name as "categoryName", categories.name FROM games JOIN categories ON games."categoryId"=categories.id ;`
  );

  res.status(200).send(ListOfgames.rows);
}

export { RegisterNewGame, GetGames };
