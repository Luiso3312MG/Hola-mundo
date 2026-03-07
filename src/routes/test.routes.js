const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/email", async (req, res) => {

  try {

    const [rows] = await pool.query(
      `SELECT id FROM roles LIMIT 1`
    );

    if (rows.length === 0) {
      return res.json({
        ok: false,
        message: "No hay usuarios"
      });
    }

    return res.json({
      ok: true,
      email: rows[0].code
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error en consulta"
    });

  }

});

module.exports = router;