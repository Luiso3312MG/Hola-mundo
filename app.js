require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./src/routes/auth.routes");
const pageRoutes = require("./src/routes/page.routes");
const userRoutes = require("./src/routes/user.routes");
const testRoutes = require("./src/routes/test.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secreto_temporal",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // en Railway con HTTPS luego puede ir en true
      maxAge: 1000 * 60 * 60 * 8 // 8 horas
    }
  })
);

// archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// rutas de páginas
app.use("/", pageRoutes);

// rutas API
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);


app.use("/api/test", testRoutes);