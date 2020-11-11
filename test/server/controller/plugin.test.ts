import pg from "pg";
import { TRADE } from "./../common";
import { Controller } from "./../../../src/server/controller";

describe("Controller Unit Tests", function () {
  describe("Write", function () {
    it("should invoke db when writing", async function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [{ id: TRADE.id }],
      });

      const controller: Controller = new Controller();
      const response = await controller.write(TRADE);

      /* To-do: this should be modified to simply return the id only. */
      expect(response).toEqual({ rows: [{ id: TRADE.id }] });

      jest.resetAllMocks();
    });

    it("should throw an error if write action fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      await expect(new Controller().write(TRADE)).rejects.toThrow(Error);
    });
  });

  describe("Read", function () {
    it("should invoke db when reading", async function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [TRADE],
      });

      const controller: Controller = new Controller();
      const response = await controller.read(TRADE.id);

      /* To-do: this should be modified to simply return the id only. */
      expect(response).toEqual({ rows: [TRADE] });

      jest.resetAllMocks();
    });

    it("should throw an error if read action fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      await expect(new Controller().read(TRADE.id)).rejects.toThrow(Error);
    });
  });
});
