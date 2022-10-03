import connection from "../database.js";

async function GetRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  //validation customerId
  const userExisting = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [customerId]
  );
  if (userExisting.rows.length === 0) {
    return res.status(400).send(`Do not exists client with id "${customerId}"`);
  }

  //validation gameId
  const gameExisting = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [gameId]
  );
  if (gameExisting.rows.length === 0) {
    return res.status(400).send(`Do not exists game with id "${customerId}"`);
  }

  res.sendStatus(201);
}

export { GetRentals };
