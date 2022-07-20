const express = require("express");
const bodyParser = require("body-parser");
const usuarioRoute = require("./routes");
const app = express();
const PORT = 4000;

app.use(bodyParser.json()); //para ter o body da request
app.use("/", usuarioRoute);
app.use(bodyParser.json());
app.listen(PORT, () => console.log("Rodando em " + PORT));
