const featureModel = require('../models/featureModel');
const qualityMeasure = require('../models/qualityMeasure');
const valeThresholds = require('../models/valeThresholds');
const valeMethod = require('../core/thresholdcalculationmethods/vale');

const run = async (req, res) => {
    try {
        // get all feature models
        const featureModelList = await featureModel.find({ useInThresholds:true });
        // get all quality measures
        const qualityMeasureList = await qualityMeasure.find();

        const thresholds = await valeMethod.run(featureModelList, qualityMeasureList);
        const newValeThresholds = await valeThresholds.create({ thresholds });

        return res.status(200).send({ newValeThresholds });
    } catch (err) {
        return res.status(400).send({ error: 'Error running vale method' });
    }
}

const getThresholds = async (req, res) => {
    try {
        const returnedValeThresholds = await valeThresholds.findOne().populate('thresholds.qualityMeasure').sort('-createdAt');

        return res.status(200).send({ returnedValeThresholds });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading vale thresholds' });
    }
}

module.exports = { run, getThresholds };
