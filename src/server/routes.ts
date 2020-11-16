import express, { json } from "express";
import cors from "cors";
import Controller from "./controller/index";
import { Trade } from "./types/index";

const environment: string | undefined = process.env.PORT;
const controller = new Controller();

const app = express();

app.use(express.urlencoded());
app.use(json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(`${__dirname}/../client/dist`));

app.put("/trade/:user/write", function (req, res) {
  const body: Trade = req.body;

  controller
    .write(body)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/id/find/:id", function (req, res) {
  const query = req.params.id;

  controller
    .read(query)
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/ticker/find/:ticker", function (req, res) {
  const query = req.params.ticker;

  controller
    .readByTicker(query)
    .then(function (response: {}) {
      res.status(200).send(response);
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/company/find/:company", function (req, res) {
  const query = req.params.company;

  controller
    .readByCompany(query)
    .then(function (response: {}) {
      res.status(200).send(response);
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/date/find/:date", function (req, res) {
  const query = req.params.date;

  controller
    .readByDate(query)
    .then(function (response: object) {
      res.status(200).send(response);
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

export { app, environment };
