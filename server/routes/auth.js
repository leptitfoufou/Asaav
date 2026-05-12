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



router.post("/admins", async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      error: "Champs obligatoires manquants"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `
    INSERT INTO admins (
      firstname,
      lastname,
      email,
      password,
      role
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      firstname,
      lastname,
      email,
      hashedPassword,
      role || "admin"
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Admin créé avec succès",
        admin: {
          id: this.lastID,
          firstname,
          lastname,
          email,
          role: role || "admin"
        }
      });
    }
  );
});


router.delete("/admins/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM admins WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Admin introuvable"
        });
      }

      res.json({
        message: "Admin supprimé avec succès"
      });
    }
  );
});
router.get("/admins", (req, res) => {
  db.all(
    "SELECT id, firstname, lastname, email, role, created_at FROM admins ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

module.exports = router;