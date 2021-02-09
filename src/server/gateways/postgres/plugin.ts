import Gateway from "./../gateway";
import { Pool, PoolClient, QueryResult } from "pg";
import { Trade } from "./../../types";
import { TRANSACTIONS } from "./constants";
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

  public async readAll(): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = "SELECT * FROM trades";

      const response: QueryResult = await client.query(queryText);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      /*
      This format will allow Winston to log the error message as "Error: [error message]".
      Additionally, Winston will also save the error stack so we can trace the error.
      */
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async readFive(): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string =
        "SELECT * FROM trades WHERE created_at > now() - INTERVAL '1 week'";

      const response: QueryResult = await client.query(queryText);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async read(
    id: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = "SELECT * FROM trades WHERE id = $1";

      const response: QueryResult = await client.query(queryText, [id]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async readByTicker(
    ticker: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = "SELECT * FROM trades WHERE ticker = $1";

      const response: QueryResult = await client.query(queryText, [ticker]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async readByCompany(
    company: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = "SELECT * FROM trades WHERE company_name = $1";

      const response: QueryResult = await client.query(queryText, [company]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async readByDate(
    date: Date
  ): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = "SELECT * FROM trades WHERE created_at = $1";

      const response: QueryResult = await client.query(queryText, [date]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async readByReferenceNumber(
    refNum: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string =
        "SELECT * FROM trades WHERE reference_number = $1";

      const response: QueryResult = await client.query(queryText, [refNum]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async update(
    document: Trade
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    const client = await this.pool.connect();
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
      trade_action,
    } = document;

    try {
      const queryText: string =
        "UPDATE trades SET ticker = $1, company_name = $2, reference_number = $3, unit_price = $4, quantity = $5, total_cost = $6, trade_type = $7, note = $8, created_at = $9, trade_status = $10, trade_action = $11, id = $12 WHERE id = $12 RETURNING id";
      const response: QueryResult = await client.query(queryText, [
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
        trade_action,
        id,
      ]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

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
      trade_action,
    } = document;

    try {
      const queryText: string =
        "INSERT INTO trades (id, ticker, company_name, reference_number, unit_price, quantity, total_cost, trade_type, note, created_at, trade_status, trade_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id";
      const response: QueryResult = await client.query(queryText, [
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
        trade_action,
      ]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }

  public async delete(
    id: string
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = "DELETE FROM trades WHERE id = $1 RETURNING id";

      const response: QueryResult = await client.query(queryText, [id]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      await client.query(TRANSACTIONS.ROLLBACK);

      throw err;
    } finally {
      client.release();
    }
  }
}
