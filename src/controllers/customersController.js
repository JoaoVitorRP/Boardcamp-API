import dayjs from "dayjs";
import { connection } from "../database/db.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    let customers;
    if (cpf) {
      customers = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1;`, [`${cpf}%`]);
    } else {
      customers = await connection.query(`SELECT * FROM customers;`);
    }

    for (let i = 0; i < customers.rows.length; i++) {
      const currentRow = customers.rows[i];

      currentRow.birthday = dayjs(currentRow.birthday).format("YYYY-MM-DD");
    }

    res.send(customers.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await connection.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

    if (customer.rows.length === 0) return res.sendStatus(404);

    customer.rows[0].birthday = dayjs(customer.rows[0].birthday).format("YYYY-MM-DD");

    res.send(customer.rows);
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
      `UPDATE customers
        SET name = '${name}', phone = '${phone}', cpf = '${cpf}', birthday = '${birthday}'
        WHERE id = $1;`,
      [id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}
