import { connection } from "../database/db.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    const customers = await connection.query(
      `
      SELECT *, customers.birthday::text 
      FROM customers 
      ${cpf ? `WHERE cpf LIKE $1` : ` `};
      `,
      cpf ? [`${cpf}%`] : []
    );

    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await connection.query(
      `
      SELECT *, customers.birthday::text 
      FROM customers 
      WHERE id = $1;
      `,
      [id]
    );

    if (customer.rows.length === 0) return res.status(404).send("Could not find a costumer with this id");

    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      `INSERT
      INTO customers (name, phone, cpf, birthday)
      VALUES ('${name}', '${phone}', '${cpf}', '${birthday}');`
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function editCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    await connection.query(
      `
      UPDATE customers
      SET name = '${name}', phone = '${phone}', cpf = '${cpf}', birthday = '${birthday}'
      WHERE id = $1;
      `,
      [id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}
