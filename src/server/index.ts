import cors from "cors";
import express, { Request, Response } from "express";
import { Controller } from "./controller";
import { INTERNAL_SERVER_ERROR } from './common'

/* Server configuration steps. */
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.put("/trade/write", function (req: Request, res: Response) {
  const { body } = req;
  new Controller()
    /* We're assuming the body isn't malformed or anything here. */
    .write(body)
    .then(function (id) {
      res.status(200).send(id);
    })
    /* The error should be handled by now, so we can safely swallow it. */
    .catch(function () {
      res.status(500).send(INTERNAL_SERVER_ERROR);
    });
});

app.get("/trade/read/:id", function (req: Request, res: Response) {
  const {
    params: { id },
  } = req;
  new Controller()
    .read(id)
    .then(function (trade) {
      res.status(200).send(trade);
    })
    .catch(function () {
      res.status(500).send(INTERNAL_SERVER_ERROR);
    });
});

const port: number =
  process.env.PORT == null ? 3000 : parseInt(process.env.PORT);

app.listen(function () {
  console.log(`Server listening on port ${port}`);
});

export default app;
