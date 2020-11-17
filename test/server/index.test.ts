import request from "supertest";
import { app } from "../../src/server/index";

describe("App Server Tests", function () {
  describe("Routes", function () {
    it("should reject falsy routes and return 404 not found", function (done) {
      request(app)
        .get("/falsy/route")
        .expect(404)
        .expect("Content-type", "text/html; charset=utf-8")
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return 200 OK for the id get route", function (done) {
      request(app)
        .get("/trade/id/find/id")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return 200 OK for the ticker get route", function (done) {
      request(app)
        .get("/trade/ticker/find/ticker")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return 200 OK for the company get route", function (done) {
      request(app)
        .get("/trade/company/find/company")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return 200 OK for the date get route", function (done) {
      request(app)
        .get("/trade/date/find/date")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Port", function () {
    let module: { [port: string]: "" };

    beforeAll(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    afterAll(function (done) {
      jest.resetAllMocks();
      jest.resetModules();
      delete process.env.PORT;
      done();
    });

    it("should not use the default 3000 port if a custom port is provided", async function () {
      process.env.PORT = "5000";
      jest.isolateModules(function () {
        module = require("../../src/server/index");
      });
      expect(module.port).toEqual(5000);
    });
  });
});
