import connection from "../database.js";
import joi from "joi";

const categorieSchema = joi.object({
  name: joi.string().required().empty(" "),
});

async function RegisterNewCategorie(req, res) {
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

  //validation if category is registered
  const categorieExisted = await connection.query(
    "SELECT * FROM categories WHERE name = $1;",
    [name]
  );

  if (categorieExisted.rows.length > 0) {
    return res.status(409).send(`The categorie "${name}" is ready registered`);
  }

  //register new category
  connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);

  res.sendStatus(201);
}

export { RegisterNewCategorie };
