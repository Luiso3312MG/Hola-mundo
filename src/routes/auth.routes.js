const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Correo y contraseña son obligatorios"
      });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        u.id,
        u.studio_id,
        u.role_id,
        u.first_name,
        u.last_name,
        u.email,
        u.password_hash,
        u.is_active,
        r.code AS role_code
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.email = ?
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Usuario o contraseña incorrectos"
      });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        ok: false,
        message: "Tu usuario está inactivo"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: "Usuario o contraseña incorrectos"
      });
    }

    req.session.user = {
      id: user.id,
      studio_id: user.studio_id,
      role_id: user.role_id,
      role_code: user.role_code,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };

    await pool.query(
      `UPDATE users SET last_login_at = NOW() WHERE id = ?`,
      [user.id]
    );

    return res.json({
      ok: true,
      message: "Login correcto",
      user: req.session.user
    });
  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
});

// SESIÓN ACTUAL
router.get("/me", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      ok: false,
      message: "No autenticado"
    });
  }

  return res.json({
    ok: true,
    user: req.session.user
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).json({
        ok: false,
        message: "No se pudo cerrar sesión"
      });
    }

    res.clearCookie("connect.sid");

    return res.json({
      ok: true,
      message: "Sesión cerrada"
    });
  });
});

module.exports = router;