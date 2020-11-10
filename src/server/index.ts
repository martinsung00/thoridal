import app from "./routes";

const environment: string | undefined = process.env.PORT;
const port: number = environment == null ? 3000 : parseInt(environment);

app.listen(port, function () {
  console.log(`listening on ${port}`);
});

export default app;
