const express = require("express");
const { startTicketsSimulation, stopTicketsSimulation, ticketsSimulationStatus, configTicketsSimulation } = require("../controller/ticketController");

const router = express.Router();

router.post("/start", startTicketsSimulation);
router.post("/stop", stopTicketsSimulation);
router.post("/configure", configTicketsSimulation);
router.get("/status",ticketsSimulationStatus );

module.exports = router;