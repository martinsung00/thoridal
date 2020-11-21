import { Trade } from "../../../src/server/types";
import Controller from "./../../../src/server/controller/plugin";
import { PostgresGateway } from "../../../src/server/gateways/index";

describe("Controllers Test", function () {
  jest.mock("../../../src/server/gateways/index");

  const controller = new Controller();
  const trade: Trade = {
    id: "abc",
    ticker: "ABC",
    company_name: "Test",
    reference_number: "12345",
    unit_price: 0,
    quantity: 0,
    total_cost: 0,
    trade_type: "long",
    note: "",
    created_at: "10/10/2020",
    trade_status: true,
  };
  const logger = jest.spyOn(controller.db.logger, "log");

  afterAll(function () {
    jest.resetModules();
    jest.resetAllMocks();
  });

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

    it("should write a trade to db and return an id", async function (done) {
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
        reference_number: "12345",
        ticker: "ABC",
        total_cost: 0,
        trade_status: true,
        trade_type: "long",
        unit_price: 0,
      });
      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.write = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.write(trade);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        done();
      }
    });
  });

  describe("Update Action", function () {
    beforeEach(function () {
      PostgresGateway.prototype.update = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });
    });

    it("should write a trade to db and return an id", async function (done) {
      const result: {
        rows: Array<{ id: string }>;
      } = await controller.update(trade);

      expect(result.rows[0].id).toEqual("abc");
      expect(PostgresGateway.prototype.update).toHaveBeenCalledWith(trade);
      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.update = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.update(trade);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        done();
      }
    });
  });

  describe("Delete Action", function () {
    beforeEach(function () {
      PostgresGateway.prototype.delete = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });
    });

    it("should write a trade to db and return an id", async function (done) {
      const result: {
        rows: Array<{ id: string }>;
      } = await controller.delete(trade.id);

      expect(result.rows[0].id).toEqual("abc");
      expect(PostgresGateway.prototype.delete).toHaveBeenCalledWith(trade.id);
      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.delete = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.delete(trade.id);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        done();
      }
    });
  });

  describe("Read Action", function () {
    beforeAll(function () {
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue(trade);
    });

    it("should return a document given an id", async function (done) {
      const result = await controller.read(trade.id);

      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.read).toHaveBeenCalledWith(trade.id);
      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.read = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.read(trade.id);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
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

    it("should return a document given a ticker", async function (done) {
      const result = await controller.readByTicker(trade.ticker);

      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.readByTicker).toHaveBeenCalledWith(
        trade.ticker
      );

      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      const logger = jest.spyOn(controller.db.logger, "log");

      try {
        PostgresGateway.prototype.readByTicker = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.readByTicker(trade.ticker);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
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

    it("should return a document given a company name", async function (done) {
      const result = await controller.readByCompany(trade.company_name);

      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.readByCompany).toHaveBeenCalledWith(
        trade.company_name
      );

      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.readByCompany = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.readByCompany(trade.created_at);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        done();
      }
    });
  });

  describe("Read Action by Date", function () {
    beforeAll(function () {
      PostgresGateway.prototype.readByDate = jest.fn().mockResolvedValue(trade);
    });

    it("should return a document given a date", async function (done) {
      const result = await controller.readByDate(trade.created_at);

      expect(result).toEqual(trade);
      expect(PostgresGateway.prototype.readByDate).toHaveBeenCalledWith(
        trade.created_at
      );

      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.readByDate = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.readByDate(trade.created_at);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        done();
      }
    });
  });

  describe("Read Action by Reference Number", function () {
    beforeAll(function () {
      PostgresGateway.prototype.readByReferenceNumber = jest
        .fn()
        .mockResolvedValue(trade);
    });

    it("should return a document given a date", async function (done) {
      const result = await controller.readByReferenceNumber(
        trade.reference_number
      );
      expect(result).toEqual(trade);
      expect(
        PostgresGateway.prototype.readByReferenceNumber
      ).toHaveBeenCalledWith(trade.reference_number);

      done();
    });

    it("should log the error with Winston logger if the query fails", async function (done) {
      try {
        PostgresGateway.prototype.readByReferenceNumber = jest
          .fn()
          .mockRejectedValue(new Error("Fake Error"));

        await controller.readByReferenceNumber(trade.reference_number);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith("Fake Error");
      } catch (err) {
        expect(err.message).toEqual("Fake Error");
        done();
      }
    });
  });
});
