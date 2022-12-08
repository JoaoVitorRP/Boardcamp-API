import { connection } from "../database/db.js";
import { customerSchema } from "../schemas/customerSchema.js";

export async function customerValidation(req, res, next) {
  const { cpf } = req.body;

  const { error } = customerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customerWithSameCPF = await connection.query(`SELECT * FROM customers WHERE cpf = '${cpf}'`);
    if (customerWithSameCPF.rows.length !== 0) return res.sendStatus(409);
  } catch (err) {
    return res.status(500).send(err);
  }

  next();
}
