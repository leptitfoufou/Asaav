const express = require("express");
const cors = require("cors");
const db = require("./database/db");
require("./database/init");
const registrationsRoutes = require("./routes/registrations");
const app = express();
const eventsRoutes = require("./routes/events");
const membersRoutes = require("./routes/members");
const partnersRoutes = require("./routes/partners");

app.use(cors());
app.use(express.json());
app.use("/events", eventsRoutes);
app.use("/registrations", registrationsRoutes);
app.use("/members", membersRoutes);
app.use("/partners", partnersRoutes);

app.get("/", (req, res) => {
  res.send("ASAAV API fonctionne");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});