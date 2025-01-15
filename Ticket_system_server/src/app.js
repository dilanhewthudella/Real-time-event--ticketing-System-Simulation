const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const AsyncLock = require('async-lock');

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});