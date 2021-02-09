import { app, envPort } from "./routes";

const port: number = envPort == null ? 3000 : parseInt(envPort);

app.listen(port, function () {
  console.log(`listening on ${port}`);
});

export { app, port };
