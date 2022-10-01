import joi from "joi";

const newGameSchema = joi.object({
  name: joi.string().required().empty(" "),
  image: joi.string().required().empty(" "),
  stockTotal: joi.number().required().positive(),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().required().positive(),
});

function RegisterNewGame(req, res) {
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

  res.sendStatus(201);
}

export { RegisterNewGame };
