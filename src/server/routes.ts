import express, { json, urlencoded } from "express";
import cors from "cors";
import Controller from "./controller/index";
import { Trade } from "./types/index";
import Gateway from "./gateways/gateway";

const envPort: string | undefined = process.env.PORT;
const controller = new Controller();
class ThinGateway extends Gateway {}
const gateway = new ThinGateway();

const app = express();

app.use(urlencoded());
app.use(json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(`${__dirname}/../client/dist`));

app.put("/trade/:user/write", async function (req, res) {
  const body: Trade = req.body;

  if (!req.body.id) {
    res.sendStatus(400);
    return;
  }

  const precedence = await controller.read(body.id).catch(function (err) {
    gateway.logger.log("error", "Error:", err);
    return err;
  });

  if (!precedence.rows) {
    // If controller.read fails, precedence will not have the rows property.

    res.sendStatus(500);
    return;
  } else if (precedence.rows.length > 0) {
    // If precedence.rows has a length of 0, the id does not exist.
    // Created at must be generated in this scope, or else we can't detect if the req.body is missing (bad input).

    body.created_at = controller.generateDate();

    try {
      const result = await controller.update(body);

      res.status(200).send(result);
      return;
    } catch (err) {
      gateway.logger.log("error", "Error:", err);
      res.sendStatus(500);
      return err;
    }
  } else {
    body.created_at = controller.generateDate();

    try {
      const result = await controller.write(body);

      res.status(200).send(result);
      return;
    } catch (err) {
      gateway.logger.log("error", "Error:", err);
      res.sendStatus(500);
      return err;
    }
  }
});

app.get("/trade/id/:id/find", async function (req, res) {
  const query = req.params.id;

  try {
    const result = await controller.read(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/ticker/:ticker/find", async function (req, res) {
  const query = req.params.ticker;

  try {
    const result = await controller.readByTicker(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/company/:company/find", async function (req, res) {
  const query = req.params.company;

  try {
    const result = await controller.readByCompany(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/date/:date/find", async function (req, res) {
  const query = req.params.date;

  try {
    const result = await controller.readByDate(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/reference/:reference/find", async function (req, res) {
  const query = req.params.reference;

  try {
    const result = await controller.readByReferenceNumber(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.delete("/trade/id/:id/delete", async function (req, res) {
  const query = req.params.id;

  try {
    const result = await controller.delete(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

export { app, envPort };
