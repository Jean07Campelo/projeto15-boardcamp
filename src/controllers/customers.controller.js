import connection from "../database.js";

async function GetCustomers(req, res) {
  const customers = await connection.query("SELECT * FROM customers;");
  res.status(200).send(customers.rows);
}

export { GetCustomers };
