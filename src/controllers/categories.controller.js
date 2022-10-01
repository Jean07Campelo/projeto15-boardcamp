import connection from "../database.js";
import joi from "joi";

const categorySchema = joi.object({
  name: joi.string().required().empty(" "),
});

async function RegisterNewCategory(req, res) {
  const { name } = req.body;

  const validationCategory = categorySchema.validate(req.body, {
    abortEarly: false,
  });
  if (validationCategory.error) {
    const errors = validationCategory.error.details.map(
      (detail) => detail.message
    );
    res.status(400).send(errors);
  }

  //validation if category is registered
  const categoryExisted = await connection.query(
    "SELECT * FROM categories WHERE name = $1;",
    [name]
  );

  if (categoryExisted.rows.length > 0) {
    return res.status(409).send(`The category "${name}" is ready registered`);
  }

  //register new category
  connection.query("INSERT INTO category (name) VALUES ($1);", [name]);

  res.sendStatus(201);
};

async function GetCategories(req, res) {
  const categories = await connection.query("SELECT * FROM categories;");
  res.status(200).send(categories.rows);
}

export { RegisterNewCategory, GetCategories };
