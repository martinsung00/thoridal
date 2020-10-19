import Gateway from "./../gateway";
import { Pool } from "pg";

export default class PostgresGateway extends Gateway {
  pool: Pool;

  constructor() {
    super("PostgresGateway");

    // To-do: Abstract this away.
    this.pool = new Pool({
      user: "me",
      host: "localhost",
      database: "api",
      password: "password",
      port: 5432,
    });
  }

  public async get(id: string): Promise<object> {
    try {
      // To-do: Design an ORM. Do not ship to production with a string query.
      const response = await this.pool.query(
        `SELECT * FROM ... WHERE id = ${id}`
      );
      return response.rows;
    } catch (err) {
      // To-do: We should be handling this according to the design.
      throw err;
    }
  }

  public async write(kitten: {
    id: string;
    name: string;
    age: number;
  }): Promise<string> {
    try {
      const { id, name, age } = kitten;
      await this.pool.query(
        "INSERT INTO TABLE_NAME (id, name, age) VALUES ($1, $2, $3)",
        [id, name, age]
      );
      return id;
    } catch (err) {
      // To-do: We should be handling this according to the design.
      throw err;
    }
  }
}
