const AsyncLock = require("async-lock");
const fs = require("fs");
const path = require("path");

let config = {
  maxTickets: 100,
  ticketReleaseRate: 1000,
  customerRetrievalRate: 1500,
};
const ticketPool = [];
const lock = new AsyncLock();
let producerInterval = null;
let consumerInterval = null;
const configFilePath = path.join(__dirname, "userConfigurations.json");

const saveConfigToFile = (newConfig) => {
  try {
      fs.writeFileSync(
        configFilePath,
        JSON.stringify(newConfig, null, 2),
        "utf8"
      );
  } catch (error) {
    console.log(error);
  }
};

exports.startTicketsSimulation = (req, res) => {
  try {
    if (producerInterval || consumerInterval) {
      return res.status(400).send({ message: "Simulation already running" });
    }
    producerInterval = setInterval(() => {
      lock.acquire("ticketPool", () => {
        if (ticketPool.length < config.maxTickets) {
          ticketPool.push({ id: Date.now() });
          console.log("Ticket added:", ticketPool.length);
        }
      });
    }, config.ticketReleaseRate);

    consumerInterval = setInterval(() => {
      lock.acquire("ticketPool", () => {
        if (ticketPool.length > 0) {
          ticketPool.shift();
          console.log("Ticket purchased:", ticketPool.length);
        }
      });
    }, config.customerRetrievalRate);

    res.send({ message: "Simulation started" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.stopTicketsSimulation = (req, res) => {
  try {
    clearInterval(producerInterval);
    clearInterval(consumerInterval);
    producerInterval = null;
    consumerInterval = null;
    res.send({ message: "Simulation stopped" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.configTicketsSimulation = (req, res) => {
  try {
    config = { ...config, ...req.body };
    saveConfigToFile(config);
    res.send({ message: "Configuration updated", config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.ticketsSimulationStatus = (req, res) => {
  try {
    res.send({
      ticketCount: ticketPool.length,
      maxTickets: config.maxTickets,
      ticketReleaseRate: config.ticketReleaseRate,
      customerRetrievalRate: config.customerRetrievalRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
