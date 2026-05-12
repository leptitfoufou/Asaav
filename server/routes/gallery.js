const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.post("/", (req, res) => {
  const { event_id, image } = req.body;

  if (!event_id || !image) {
    return res.status(400).json({
      error: "event_id et image sont obligatoires"
    });
  }

  db.run(
    `
    INSERT INTO gallery_photos (event_id, image)
    VALUES (?, ?)
    `,
    [event_id, image],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Photo ajoutée",
        photo: {
          id: this.lastID,
          event_id,
          image
        }
      });
    }
  );
});

router.get("/", (req, res) => {
  db.all(
    `
    SELECT gallery_photos.*, events.title, events.event_date
    FROM gallery_photos
    JOIN events ON gallery_photos.event_id = events.id
    ORDER BY events.event_date DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

router.get("/:eventId", (req, res) => {
  const { eventId } = req.params;

  db.all(
    "SELECT * FROM gallery_photos WHERE event_id = ? ORDER BY created_at DESC",
    [eventId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM gallery_photos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Photo supprimée"
    });
  });
});




router.post("/archives", (req, res) => {
  const { event_id, archive_file } = req.body;

  if (!event_id || !archive_file) {
    return res.status(400).json({
      error: "event_id et archive_file sont obligatoires"
    });
  }

  db.run(
    `
    INSERT INTO gallery_archives (event_id, archive_file)
    VALUES (?, ?)
    `,
    [event_id, archive_file],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Archive ajoutée",
        archive: {
          id: this.lastID,
          event_id,
          archive_file
        }
      });
    }
  );
});

router.get("/archives", (req, res) => {
  db.all(
    `
    SELECT gallery_archives.*, events.title, events.event_date
    FROM gallery_archives
    JOIN events ON gallery_archives.event_id = events.id
    ORDER BY events.event_date DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

router.get("/archives/:eventId", (req, res) => {
  const { eventId } = req.params;

  db.get(
    `
    SELECT *
    FROM gallery_archives
    WHERE event_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [eventId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(row || null);
    }
  );
});

router.delete("/archive-photos/:eventId", (req, res) => {
  const { eventId } = req.params;

  db.run(
    "DELETE FROM gallery_photos WHERE event_id = ?",
    [eventId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Photos individuelles supprimées",
        deleted: this.changes
      });
    }
  );
});




module.exports = router;