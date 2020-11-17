import pg from "pg";
import { Trade } from "../../../../src/server/types";
import { PostgresGateway } from "./../../../../src/server/gateways";

describe("Postgres Gateway Tests", function () {
  jest.mock("pg");

  const db = new PostgresGateway();
  const now: string = db.generateDate();
  const trade: Trade = {
    id: "abc",
    ticker: "ABC",
    company_name: "",
    reference_number: "",
    unit_price: 0,
    quantity: 0,
    total_cost: 0,
    trade_type: "long",
    note: "",
    created_at: now,
    trade_status: true,
  };
  const logger = jest.spyOn(db.logger, "log");

  describe("Write Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should write a trade to db and return an id", async function (done) {
      const result = await db.write(trade);
      expect(result.rows).toEqual([
        {
          id: "abc",
        },
      ]);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(
        `INSERT INTO trades (id, ticker, company_name, reference_number, unit_price, quantity, total_cost, trade_type, note, created_at, trade_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        ["abc", "ABC", "", "", 0, 0, 0, "long", "", now, true]
      );
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
    /*
    Since the error message will always match what is thrown in the stub,
    it is wiser to test if Winston is able to log errors instead.
    */
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));
        await db.write(trade);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given an id", async function (done) {
      const result = await db.read(trade.id);
      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(`SELECT * FROM trades WHERE id = $1`, ["abc"]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));
        await db.read(trade.id);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action by Ticker", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given a ticker", async function (done) {
      const result = await db.readByTicker(trade.ticker);
      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(`SELECT * FROM trades WHERE ticker = $1`, ["ABC"]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));
        await db.readByTicker(trade.ticker);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action by Company Name", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given a company name", async function (done) {
      const result = await db.readByCompany(trade.company_name);
      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(`SELECT * FROM trades WHERE company_name = $1`, [
        "",
      ]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));
        await db.readByCompany(trade.company_name);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action by Date", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given a date", async function (done) {
      const result = await db.readByDate(trade.created_at);
      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(`SELECT * FROM trades WHERE created_at = $1`, [
        now,
      ]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));
        await db.readByDate(trade.created_at);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });
});
