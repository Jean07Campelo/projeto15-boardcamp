import joi from "joi";
import dayjs from "dayjs";
import connection from "../database.js";

const clientSchema = joi.object({
  name: joi.string().required().empty(" "),
  phone: joi.string().required().min(10).max(11),
  cpf: joi.string().required().length(11),
  birthday: joi.string().required(),
});

async function GetCustomers(req, res) {
  const customers = await connection.query("SELECT * FROM customers;");
  const { cpf } = req.query;

  if (cpf) {
    const customersFiltered = await connection.query(
      `SELECT * FROM customers WHERE customers.cpf LIKE '%${cpf}%';`
    );
    return res.status(200).send(customersFiltered.rows);
  }

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
    return res.status(400).send(`${birthday} is invalid`);
  }

  const birthdayFormat = dayjs(birthday).format("YYYY-MM-DD");

  //validation if cpf is registered
  const documentIsRegistered = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1;",
    [cpf]
  );

  if (documentIsRegistered.rows.length > 0) {
    return res.status(409).send(`The document ${cpf} is already registered`);
  }

  //register new client
  await connection.query(
    `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
    [name, phone, cpf, birthdayFormat]
  );

  res.sendStatus(201);
}

async function GetClientByID(req, res) {
  const { id } = req.params;

  const clienteById = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [id]
  );

  if (clienteById.rows.length === 0) {
    return res.status(404).send(`Do not exists user with id: ${id}`);
  }

  res.status(200).send(clienteById.rows[0]);
}

async function UpdateClientById(req, res) {
  const { id } = req.params;

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
    return res.status(400).send(`${birthday} is invalid`);
  }

  //validation cpf
  const documentIsRegistered = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1;",
    [cpf]
  );
  if (documentIsRegistered.rows.length > 0) {
    return res.status(409).send(`The cpf "${cpf} is already registered"`);
  }

  res.sendStatus(200);
}

export { GetCustomers, RegisterNewClient, GetClientByID, UpdateClientById };
