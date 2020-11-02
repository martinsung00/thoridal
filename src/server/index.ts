import app from "./routes";

const env: string | undefined = process.env.PORT;
const port: number = env == null ? 3000 : parseInt(env);

app.listen(port, function () {
  console.log(`listening on ${port}`);
});

export default app;
