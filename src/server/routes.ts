import express, { json, urlencoded } from "express";
import cors from "cors";
import Controller from "./controller/index";
import { Trade } from "./types/index";
import WinstonLogger from "./winston";
import path from "path";

class ThinLogger extends WinstonLogger {}
const serverLog = new ThinLogger();
const envPort: string | undefined = process.env.PORT;
const controller = new Controller();

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/", express.static(path.resolve(__dirname, "../../dist")));

app.put("/trade/:user/write", async function (req, res) {
  const body: Trade = req.body;
  let precedence: boolean = false;

  if (!req.body.id) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    const result: {
      rows: Trade[];
    } = await controller.read(body.id);

    result.rows.length > 0 ? (precedence = true) : (precedence = false);
  } catch (err) {
    serverLog.logger.log("error", "Error:", err);

    // Escape early if read fails
    res.status(500).send("Internal Server Error");
    return err;
  }

  if (!!precedence) {
    try {
      const result: {
        rows: {
          id: string;
        }[];
      } = await controller.update(body);

      res.status(200).send(result);
      return;
    } catch (err) {
      serverLog.logger.log("error", "Error:", err);
      res.status(500).send("Internal Server Error");
      return err;
    }
  } else {
    try {
      body.created_at = new Date();

      const result: {
        rows: {
          id: string;
        }[];
      } = await controller.write(body);

      res.status(200).send(result);
      return;
    } catch (err) {
      serverLog.logger.log("error", "Error:", err);
      res.status(500).send("Internal Server Error");
      return err;
    }
  }
});

// Req does not get used, hence _req
app.get("/trade/all/find", async function (_req, res) {
  try {
    const result = await controller.readAll();

    res.status(200).send(result);
  } catch (err) {
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
    return err;
  }
});

app.get("/trade/recent/find", async function (_req, res) {
  try {
    const result = await controller.readFive();

    res.status(200).send(result);
  } catch (err) {
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
    return err;
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
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
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
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
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
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
    return err;
  }
});

app.get("/trade/date/:date/find", async function (req, res) {
  10 - 10 - 2020;
  const date: string = req.params.date;
  const month = Number(date.substring(0, 2));
  const day = Number(date.substring(3, 5));
  const year = Number(date.substring(6, 10));

  const query = new Date(month, day, year);

  try {
    const result: {
      rows: Trade[];
    } = await controller.readByDate(query);

    res.status(200).send(result);
  } catch (err) {
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
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
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
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
    serverLog.logger.log("error", "Error:", err);
    res.status(500).send("Internal Server Error");
    return err;
  }
});

export { app, envPort };
