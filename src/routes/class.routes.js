const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/class", async (req, res) => {
  try {
    // Extraer identificador y fecha de la consulta (query) o del cuerpo.
    let { studId, date } = req.query;

    // La versión de la interfaz envía userId en lugar de studId. Permitir ambos.
    if (!studId) {
      studId = req.query.userId || (req.body ? req.body.userId : undefined);
    }

    if (!date && req.body) {
      date = req.body.date;
    }

    // Validar parámetros obligatorios.
    if (!studId || !date) {
      return res.status(400).json({ ok: false, error: "Faltan parámetros studId/userId o date" });
    }

    // Ejecutar la consulta utilizando pool.query. Pasar ambos valores en un mismo array.
    const [rows] = await pool.query(
      `
      SELECT *
      FROM classes
      WHERE studio_id = ?
        AND class_date = ?
        AND status <> 'ELIMINADA'
      ORDER BY start_time ASC
      `,
      [studId, date]
    );

    // Devolver los resultados como un arreglo de clases.
    return res.json(rows);
  } catch (error) {
    console.error("Error al obtener clases:", error);
    return res.status(500).json({ ok: false, error: "Error del servidor" });
  }
});
module.exports = router;