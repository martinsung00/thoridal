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
  let precedence: boolean = false;

  if (!req.body.id) {
    res.sendStatus(400);
    return;
  }

  try {
    const result: {
      rows: Trade[];
    } = await controller.read(body.id);

    result.rows.length > 0 ? (precedence = true) : (precedence = false);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);

    // Escape early if read fails
    res.sendStatus(500);
    return;
  }

  if (!!precedence) {
    body.created_at = controller.generateDate();

    try {
      const result: {
        rows: {
          id: string;
        }[];
      } = await controller.update(body);

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
      const result: {
        rows: {
          id: string;
        }[];
      } = await controller.write(body);

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
  const query: string = req.params.id;

  try {
    const result: {
      rows: Trade[];
    } = await controller.read(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/ticker/:ticker/find", async function (req, res) {
  const query: string = req.params.ticker;

  try {
    const result: {
      rows: Trade[];
    } = await controller.readByTicker(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/company/:company/find", async function (req, res) {
  const query: string = req.params.company;

  try {
    const result: {
      rows: Trade[];
    } = await controller.readByCompany(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/date/:date/find", async function (req, res) {
  const query: string = req.params.date;

  try {
    const result: {
      rows: Trade[];
    } = await controller.readByDate(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.get("/trade/reference/:reference/find", async function (req, res) {
  const query: string = req.params.reference;

  try {
    const result: {
      rows: Trade[];
    } = await controller.readByReferenceNumber(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

app.delete("/trade/id/:id/delete", async function (req, res) {
  const query: string = req.params.id;

  try {
    const result: {
      rows: {
        id: string;
      }[];
    } = await controller.delete(query);

    res.status(200).send(result);
  } catch (err) {
    gateway.logger.log("error", "Error:", err);
    res.sendStatus(500);
    return err;
  }
});

export { app, envPort };
