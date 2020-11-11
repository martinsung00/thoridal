import Gateway from "./../gateway";
import { Pool, PoolClient } from "pg";
import { Trade } from "./../../types";
import VAULT from "./../../../../vault/dev.json";

export default class PostgresGateway extends Gateway {
  pool: Pool;

  constructor() {
    super("PostgresGateway");

    // To-do: Read these from environment.
    const { user, host, database, password, port } = VAULT;

    this.pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });
  }

  public async readById(id: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE id = '${id}'`;

      return await client.query(queryText, [id]);
    } catch (err) {
      // To-do: We should be handling this according to the design.
      this.logger.verbose({ err });
      throw err;
    } finally {
      client.release();
    }
  }

  public async readByTicker(ticker: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE ticker = ${ticker}`;

      return await client.query(queryText, [ticker]);
    } catch (err) {
      this.logger.verbose({ err });
      throw err;
    } finally {
      client.release();
    }
  }

  public async readByCompany(company: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE company_name = ${company}`;

      return await client.query(queryText, [company]);
    } catch (err) {
      this.logger.verbose({ err });
      throw err;
    } finally {
      client.release();
    }
  }

  public async readByDate(company: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE company_name = ${company}`;

      return await client.query(queryText, [company]);
    } catch (err) {
      this.logger.verbose({ err });
      throw err;
    } finally {
      client.release();
    }
  }

  public async write(
    document: Trade
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const {
        id,
        ticker,
        company_name,
        reference_number,
        unit_price,
        quantity,
        total_cost,
        trade_type,
        note,
        created_at,
        trade_status,
      } = document;

      const queryText: string = `INSERT INTO trades VALUES(${id}, ${ticker}, ${company_name}, ${reference_number}, ${unit_price}, ${quantity}, ${total_cost}, ${trade_type}, ${note}, ${created_at}, ${trade_status}) RETURNING id`;
      
      return await client.query(queryText, [
        id,
        ticker,
        company_name,
        reference_number,
        unit_price,
        quantity,
        total_cost,
        trade_type,
        note,
        created_at,
        trade_status,
      ]);
    } catch (err) {
      // To-do: We should be handling this according to the design.
      this.logger.verbose({ err });
      throw err;
    } finally {
      client.release();
    }
  }
}
