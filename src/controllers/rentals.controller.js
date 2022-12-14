import joi from "joi";
import dayjs from "dayjs";
import connection from "../database.js";

const solicitationRentalSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  daysRented: joi.number().required().positive(),
});

async function RegisterRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const validationRental = solicitationRentalSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validationRental.error) {
    const errors = validationRental.error.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errors);
  }

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
    return res.status(400).send(`Do not exists game with id "${gameId}"`);
  }

  const today = dayjs(Date.now()).format("YYYY-MM-DD");

  const priceDay = await connection.query(
    `SELECT "pricePerDay" FROM games WHERE id = $1;`,
    [gameId]
  );

  const priceRental = priceDay.rows[0].pricePerDay * daysRented;

  const gamesStock = await connection.query(
    `SELECT games."stockTotal" FROM games WHERE id = $1;`,
    [gameId]
  );

  const stock = gamesStock.rows[0].stockTotal;
  if (stock === 0) {
    return res.status(400).send("No stock available");
  }

  await connection.query(
    `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
    [customerId, gameId, today, daysRented, null, priceRental, null]
  );

  res.sendStatus(201);
}

async function GetRentals(req, res) {
  const { customer } = req.query;
  const { gameId } = req.query;

  if (customer) {
    //info client
    const customerId = await connection.query(
      `SELECT id, name FROM customers WHERE id = $1;`,
      [customer]
    );

    //info rentals by clientId
    const rentals = await connection.query(
      `SELECT * FROM rentals WHERE "customerId" = $1;`,
      [customer]
    );

    //info games rentals
    const gameRental = await connection.query(
      `SELECT games.name, games."categoryId"    
    FROM games JOIN rentals ON games.id = rentals."gameId";`
    );

    const infos = {
      ...rentals.rows[0],
      customer: customerId.rows[0],
      game: gameRental.rows,
    };
    return res.status(200).send(infos);
  }

  if (gameId) {
    const gamesRentals = await connection.query(
      `SELECT 
      games.name,
      games."categoryId", 
      rentals.* 
      FROM games  
      JOIN rentals 
      ON games.id = rentals."gameId"

      WHERE games.id = $1
      ;`,
      [gameId]
    );
    return res.status(200).send(gamesRentals.rows);
  }

  const rentals = await connection.query(`SELECT 
  games.name,
  games."categoryId", 
  rentals.* 
  FROM games  
  JOIN rentals 
  ON games.id = rentals."gameId";`);

  res.status(200).send(rentals.rows);
}

async function FinishRental(req, res) {
  const { id } = req.params;

  const rentalExist = await connection.query(
    `SELECT * FROM rentals WHERE id = $1;`,
    [id]
  );
  if (rentalExist.rows.length === 0) {
    return res.status(404).send(`Do not exist a rental with id "${id}"`);
  }

  const returnDateRental = rentalExist.rows[0].returnDate;

  if (returnDateRental) {
    return res.status(400).send(`The rental is finish`);
  }
  const today = dayjs(Date.now()).format("YYYY-MM-DD");
  await connection.query(
    `UPDATE rentals SET "returnDate" = $1 WHERE id = $2;`,
    [today, id]
  );

  const returnDateRegistered = rentalExist.rows[0].returnDateRegistered;

  const differenceDays = dayjs(returnDateRegistered).diff(today, "day");

  const gameId = rentalExist.rows[0].gameId;
  const gameRental = await connection.query(
    `SELECT * FROM games WHERE id = $1;`,
    [gameId]
  );
  const pricePerDay = gameRental.rows[0].pricePerDay;

  const priceTotal = pricePerDay * differenceDays;

  await connection.query(`UPDATE rentals SET "delayFee" = $1 WHERE id = $2;`, [
    priceTotal,
    id,
  ]);

  res.sendStatus(200);
}

async function DeleteRental(req, res) {
  const { id } = req.params;

  const rentalExist = await connection.query(
    `SELECT * FROM rentals WHERE id = $1;`,
    [id]
  );
  if (rentalExist.rows.length === 0) {
    return res.status(404).send(`The id "${id}" is invalid`);
  }

  const rentalFinalized = rentalExist.rows[0].returnDate;
  if (!rentalFinalized) {
    return res.status(400).send(`The rental is not finalized`);
  }

  await connection.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

  res.sendStatus(200);
}

export { RegisterRental, GetRentals, FinishRental, DeleteRental };
