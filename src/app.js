import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pkg;

try {
  const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log("Connected to Postgres");
} catch (err) {
  console.log(err);
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running in port ${port}`));
