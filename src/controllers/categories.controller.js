import connection from "../database.js";
import joi from "joi";

const categorieSchema = joi.object({
  name: joi.string().required().empty(" "),
});

function RegisterNewCategorie(req, res) {
  const { name } = req.body;

  const validationCategorie = categorieSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validationCategorie.error) {
    const errors = validationCategorie.error.details.map(
      (detail) => detail.message
    );
    res.status(400).send(errors);
  }

  connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);

  res.sendStatus(201);
}

export { RegisterNewCategorie };
