const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/class", async(req, res) => {
  const { studId, date } = req.params;

  const [rows] = await pool.query(`
    SELECT 
      start_time,
      end_time,
      class_type_name,
      coach_user_name,
      room_name,
      capacity,
      capacity_total
    FROM classes
    WHERE studio_id = ?
      AND class_date = ?
      AND status <> 'ELIMINADA'
    ORDER BY start_time ASC
  `,[studId],[date]);

  pool.query(sql, [studId, date], (err, results) => {
    if (err) {
      console.error("Error al obtener clases:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    res.json(results);
  });
});

module.exports = router;