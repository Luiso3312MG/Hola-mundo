const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// 👉 Cuando entren a la raíz, mandar a login
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Conexión MySQL

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Login
app.post("/login", (req, res) => {
  const { user, passwword } = req.body;

  const query = "SELECT * FROM users WHERE user = ? AND passwword = ?";

  connection.query(query, [user, passwword], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error del servidor");
    }

    if (results.length > 0) {
      res.redirect("/index.html");
      console.log(results);
    } else {
      res.send("Usuario o contraseña incorrectos");
      console.log(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});