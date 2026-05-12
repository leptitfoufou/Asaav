const fs = require("fs");
const path = require("path");

const db = require("./db");

function cleanupOldGalleryPhotos() {
  const twoYearsAgo = new Date();

  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const limitDate = twoYearsAgo.toISOString().split("T")[0];

  const sql = `
    SELECT events.id
    FROM events
    JOIN gallery_archives ON gallery_archives.event_id = events.id
    WHERE events.event_date < ?
  `;

  db.all(sql, [limitDate], (err, events) => {
    if (err) {
      console.error("Erreur nettoyage galerie :", err.message);
      return;
    }

    events.forEach((event) => {
      db.all(
        "SELECT image FROM gallery_photos WHERE event_id = ?",
        [event.id],
        (err, photos) => {
          if (err) {
            console.error(err.message);
            return;
          }

          photos.forEach((photo) => {
            const filePath = path.join(
              __dirname,
              "../../client",
              photo.image
            );

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });

          db.run(
            "DELETE FROM gallery_photos WHERE event_id = ?",
            [event.id],
            function (err) {
              if (err) {
                console.error(err.message);
                return;
              }

              if (this.changes > 0) {
                console.log(
                  `Galerie archivée automatiquement pour l'événement ${event.id}`
                );
              }
            }
          );
        }
      );
    });
  });
}

module.exports = cleanupOldGalleryPhotos;