const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM partners ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

router.post("/", (req, res) => {
  const {
    name,
    website,
    logo,
    description
  } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Le nom du partenaire est obligatoire"
    });
  }

  const sql = `
    INSERT INTO partners (
      name,
      website,
      logo,
      description
    )
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, website, logo, description],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Partenaire créé avec succès",
        partner: {
          id: this.lastID,
          name,
          website,
          logo,
          description
        }
      });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    name,
    website,
    logo,
    description
  } = req.body;

  const sql = `
    UPDATE partners
    SET
      name = ?,
      website = ?,
      logo = ?,
      description = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [name, website, logo, description, id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Partenaire modifié avec succès"
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM partners WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Partenaire supprimé avec succès"
      });
    }
  );
});

module.exports = router;