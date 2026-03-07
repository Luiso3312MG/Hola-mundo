const express = require("express");
const path = require("path");
const { requireAuth, requireGuest } = require("../middlewares/authMiddleware");

const router = express.Router();

// raíz
router.get("/", (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect("/index");
  }

  return res.redirect("/login.html");
});

// login solo para invitados
router.get("/login", requireGuest, (req, res) => {
  return res.sendFile(path.join(__dirname, "../../public/login.html"));
});

// index protegido
router.get("/index", requireAuth, (req, res) => {
  return res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;