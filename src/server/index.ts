import { app, environment } from "./routes";

const port: number = environment == null ? 3000 : parseInt(environment);

app.listen(port, function () {
  console.log(`listening on ${port}`);
});

export { app, port };
