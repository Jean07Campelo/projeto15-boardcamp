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

  res.sendStatus(201);
}

export { RegisterNewGame };
