"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const helmet = require('helmet');
const morgan = require("morgan");
const compression = require('compression');

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(compression());
app.use(helmet());
app.use(morgan("tiny"))

// load routes
const indexRoutes = require("./routes/indexRoutes");
const XMLToJsonRoutes = require("./routes/XMLToJsonRoutes");
const userRoutes = require("./routes/userRoutes");
const featureModelRoutes = require("./routes/featureModelRoutes");
const qualityMeasureRoutes = require("./routes/qualityMeasureRoutes");
const qualityMeasureDatasetRoutes = require("./routes/qualityMeasureDatasetRoutes");
const valeThresholdsRoutes = require("./routes/valeThresholdsRoutes");
const jsonToXMLRoutes = require("./routes/jsonToXMLRoutes");

app.use("/", indexRoutes);
app.use("/xml", XMLToJsonRoutes);
app.use("/users", userRoutes);
app.use("/featuremodels", featureModelRoutes);
app.use("/qualitymeasures", qualityMeasureRoutes);
app.use("/qualitymeasuredatasets", qualityMeasureDatasetRoutes);
app.use("/valemethod", valeThresholdsRoutes);
app.use("/featuremodels", jsonToXMLRoutes);

module.exports = app;
