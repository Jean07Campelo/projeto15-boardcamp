import joi from "joi";
import connection from "../database.js";

const clientSchema = joi.object({
  name: joi.string().required().empty(" "),
  phone: joi.string().required().min(10).max(11),
  cpf: joi.string().required(),
  birthday: joi.string().required(),
});

async function GetCustomers(req, res) {
  const customers = await connection.query("SELECT * FROM customers;");
  res.status(200).send(customers.rows);
}

async function RegisterNewClient(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  const validationNewClient = clientSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationNewClient.error) {
    const errors = validationNewClient.error.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errors);
  }

  res.sendStatus(201);
}

export { GetCustomers, RegisterNewClient };
