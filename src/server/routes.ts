import express, { json, urlencoded } from "express";
import cors from "cors";
import Controller from "./controller/index";
import { Trade } from "./types/index";

const envPort: string | undefined = process.env.PORT;
const controller = new Controller();

const app = express();

app.use(urlencoded());
app.use(json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(`${__dirname}/../client/dist`));

app.put("/trade/:user/write", function (req, res) {
  const body: Trade = req.body;

  if (Object.keys(req.body).length === 0) {
    res.sendStatus(400);
    return;
  }

  body.created_at = controller.generateDate();

  controller
    .write(body)
    .then(function () {
      res.status(200).send("OK");
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.get("/trade/id/:id/find", function (req, res) {
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

app.get("/trade/ticker/:ticker/find", function (req, res) {
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

app.get("/trade/company/:company/find", function (req, res) {
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

app.get("/trade/date/:date/find", function (req, res) {
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

app.get("/trade/reference/:reference/find", function (req, res) {
  const query = req.params.reference;

  controller
    .readByReferenceNumber(query)
    .then(function (response: object) {
      res.status(200).send(response);
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

app.delete("/trade/id/:id/delete", function (req, res) {
  const query = req.params.id;

  controller
    .delete(query)
    .then(function (response: object) {
      res.status(200).send(response);
    })
    .catch(function (err: Error) {
      res.status(500).send(err);
    });
});

export { app, envPort };
