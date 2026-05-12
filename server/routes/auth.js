const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database/db");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email et mot de passe obligatoires"
    });
  }

  db.get(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    async (err, admin) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!admin) {
        return res.status(401).json({
          error: "Identifiants incorrects"
        });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(401).json({
          error: "Identifiants incorrects"
        });
      }

      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          role: admin.role
        },
        "asaav_secret_key",
        {
          expiresIn: "1d"
        }
      );

      res.json({
        message: "Connexion réussie",
        token,
        admin: {
          id: admin.id,
          firstname: admin.firstname,
          lastname: admin.lastname,
          email: admin.email,
          role: admin.role
        }
      });
    }
  );
});

module.exports = router;