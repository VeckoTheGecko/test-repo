//The functionality of this file is currently unused

const express = require("express");
const router = express.Router();
const csvController = require("csv-exporter");

const routes = (app) => {
  router.get("/download", csvController.download);

  app.use("/api/csv", router);
};

module.exports = routes;
