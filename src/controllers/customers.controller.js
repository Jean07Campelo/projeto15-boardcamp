import joi from "joi";
import dayjs from "dayjs";
import connection from "../database.js";

const clientSchema = joi.object({
  name: joi.string().required().empty(" "),
  phone: joi.string().required().min(10).max(11),
  cpf: joi.string().required().min(11).max(11),
  birthday: joi.date().less("2022-12-31"),
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

  //validation birthday
  const birthdayIsValid = dayjs(birthday, "YYYY-MM-DD").isValid();
  if (!birthdayIsValid) {
    return res.status(400).send(`${birthday} is invalid`)
  }
  


  res.sendStatus(201);
}

export { GetCustomers, RegisterNewClient };
