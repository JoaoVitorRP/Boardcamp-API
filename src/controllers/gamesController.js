import { connection } from "../database/db.js";

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    let games;
    if (name) {
      games = await connection.query("SELECT * FROM games WHERE LOWER(name) LIKE $1;", [`${name}%`]);
    } else {
      games = await connection.query(`SELECT * FROM games;`);
    }

    let newRows = [];
    for (let i = 0; i < games.rows.length; i++) {
      const currentRow = games.rows[i];

      const categoryName = await connection.query(`SELECT * FROM categories WHERE id = ${currentRow.categoryId};`);
      newRows.push({ ...currentRow, categoryName: categoryName.rows[0].name });
    }

    res.send(newRows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function postGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      `INSERT
      INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay});`
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
