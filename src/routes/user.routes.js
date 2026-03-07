const express = require("express");

const router = express.Router();

router.get("/me", (req, res) => {

  if (!req.session || !req.session.user) {
    return res.status(401).json({
      ok: false,
      message: "No hay usuario logueado"
    });
  }

  res.json({
    ok: true,
    email: req.session.user.email
  });

});

module.exports = router;