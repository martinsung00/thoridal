import { Trade } from "../../../src/server/types";
import Controller from "./../../../src/server/controller/plugin";
import PostgresGateway from "../../../src/server/controller/index";

describe("Controllers Test", function () {
  jest.mock("../../../src/server/controller/index");

  const controller = new Controller();
  const trade: Trade = {
    id: "abc",
    ticker: "ABC",
    company_name: "Test",
    reference_number: "",
    unit_price: 0,
    quantity: 0,
    total_cost: 0,
    trade_type: "long",
    note: "",
    created_at: "10/10/2020",
    trade_status: true,
  };
  const logger = jest.spyOn(controller.db.logger, "log");

  describe("Write Action", function () {
    beforeEach(function () {
      PostgresGateway.prototype.write = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });
    });

    afterEach(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should write a trade to db and return an id", async function () {
      const result: {
        rows: Array<{ id: string }>;
      } = await controller.write(trade);
      expect(result.rows[0].id).toEqual("abc");
      expect(PostgresGateway.prototype.write).toHaveBeenCalledWith({
        company_name: "Test",
        created_at: "10/10/2020",
        id: "abc",
        note: "",
        quantity: 0,
        reference_number: "",
        ticker: "ABC",
        total_cost: 0,
        trade_status: true,
        trade_type: "long",
        unit_price: 0,
      });
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.write = jest
          .fn()
          .mockRejectedValue(new Error("Test Error"));

        await controller.readByDate(trade.created_at);
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action", function () {
    beforeAll(function () {
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should return a document given an id", async function () {
      const result = await controller.read(trade.id);
      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.read).toHaveBeenCalledWith("abc");
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.read = jest
          .fn()
          .mockRejectedValue(new Error("Test Error"));

        await controller.readByDate(trade.created_at);
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action by Ticker", function () {
    beforeAll(function () {
      PostgresGateway.prototype.readByTicker = jest
        .fn()
        .mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should return a document given a ticker", async function () {
      const result = await controller.readByTicker(trade.ticker);
      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.readByTicker).toHaveBeenCalledWith(
        "ABC"
      );
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.readByTicker = jest
          .fn()
          .mockRejectedValue(new Error("Test Error"));

        await controller.readByDate(trade.created_at);
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action by Company Name", function () {
    beforeAll(function () {
      PostgresGateway.prototype.readByCompany = jest
        .fn()
        .mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should return a document given a company name", async function () {
      const result = await controller.readByCompany(trade.company_name);
      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.readByCompany).toHaveBeenCalledWith(
        "Test"
      );
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.readByCompany = jest
          .fn()
          .mockRejectedValue(new Error("Test Error"));

        await controller.readByDate(trade.created_at);
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });

  describe("Read Action by Date", function () {
    beforeAll(function () {
      PostgresGateway.prototype.readByDate = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should return a document given a date", async function () {
      const result = await controller.readByDate(trade.created_at);
      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.readByDate).toHaveBeenCalledWith(
        "10/10/2020"
      );
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.readByDate = jest
          .fn()
          .mockRejectedValue(new Error("Test Error"));

        await controller.readByDate(trade.created_at);
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
      } finally {
        done();
      }
    });
  });
});
