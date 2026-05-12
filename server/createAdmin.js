const bcrypt = require("bcryptjs");
const db = require("./database/db");

async function createAdmin() {

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const sql = `
    INSERT INTO admins (
      firstname,
      lastname,
      email,
      password,
      role
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      "Alexis",
      "Vannay",
      "admin@asaav.ch",
      hashedPassword,
      "super_admin"
    ],
    function (err) {

      if (err) {
        console.error(err.message);
        return;
      }

      console.log("Admin créé avec succès");
      process.exit();

    }
  );
}

createAdmin();