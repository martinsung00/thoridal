import express from "express";
import pg from "pg";
import supertest from "supertest";
import { TRADE } from "./common";

describe("Server Integration Tests", function () {
  let server: express.Express;

  describe("PUT /trade/write", function () {
    beforeAll(async function () {
      server = (await import("./../../src/server")).default;
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [{ id: TRADE.id }],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should insert a trade and return an id", async function () {
      process.env.PORT = '8000';
      return await supertest(server)
        .put("/trade/write")
        .send(TRADE)
        /* To-do: This line is a bit redundant. */
        .expect(200)
        .then(function (response) {
          const {
            body: { rows },
            status,
          } = response;

          expect(rows).toEqual([{ id: TRADE.id }]);
          expect(status).toEqual(200);
        });
    });
  });

  describe("GET /trade/read/:id", function () {
    beforeAll(async function () {
      server = (await import("./../../src/server")).default;
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [TRADE],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a trade given an id", async function () {
      return await supertest(server)
        .get("/trade/read/:id")
        .set("id", TRADE.id)
        .expect(200)
        .then(function (response) {
          const {
            body: { rows },
            status,
          } = response;

          expect(rows).toEqual([TRADE]);
          expect(status).toEqual(200);
        });
    });
  });
});
