import express from "express";
import cors from "cors";
import Thoridal from "./thoridal/index";

const th = new Thoridal();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(`${__dirname}/../client/dist`));

app.put("/trade/:user/write", function (req, res) {
  const query = req.body;

  th.write(query)
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
