import express, { json } from "express";
import cors from "cors";
import Thoridal from "./thoridal/index";
import { Trade } from "./types/index";

const th = new Thoridal();

const app = express();

app.use(express.urlencoded())
app.use(json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(`${__dirname}/../client/dist`));

app.put("/trade/:user/write", function (req, res) {
  const body: Trade = req.body;

  //Check if request.body is defined for development purposes.
  console.log("request body: ", req.body);

  th.write(body)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/:id/find", function (req, res) {
  const query = req.params.id;

  th.read(query)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/:ticker/find", function (req, res) {
  const query = req.params.ticker;

  th.readByTicker(query)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/:company/find", function (req, res) {
  const query = req.params.company;

  th.readByCompany(query)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/:date/find", function (req, res) {
  const query = req.params.date;

  th.readByDate(query)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

export default app;
