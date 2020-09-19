const app = require("./app");
const port = process.env.PORT;

app.listen(port, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`-->App listening on port: ${port}`);
});
