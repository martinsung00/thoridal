import request from "supertest";
import { app, port } from "../../src/server/index";

describe("App server", function () {
  it("should utilize port 3000 or a given environment port", function () {
    expect(port).toEqual(3000);
  });

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
