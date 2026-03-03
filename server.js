const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Conexión a MySQL (Railway)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Ruta POST login
app.post("/login", (req, res) => {
  const { user, passwword } = req.body;

  const query = "SELECT * FROM users WHERE user = ? AND passwword = ?";

  db.query(query, [user, passwword], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Error del servidor");
    }

    if (results.length > 0) {
      res.redirect("/index.html");
    } else {
      res.send("Usuario o contraseña incorrectos");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});