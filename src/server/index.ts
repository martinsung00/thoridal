import app from "./routes";
import port from "./port";

app.listen(port, function () {
  console.log(`listening on ${port}`);
});

export default app;
