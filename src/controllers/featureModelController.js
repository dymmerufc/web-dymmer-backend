const featureModel = require('../models/featureModel');

const create = async (req, res) => {
    try {
        const newFeatureModel = await featureModel.create({user: req.userId, ...req.body});

        return res.status(200).send({ newFeatureModel });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new feature model' });
    }
}

const list = async (req, res) => {
    try {
        const featureModelList = await featureModel.find({public: true});

        return res.status(200).send({ featureModelList });
    } catch (err) {
        return res.status(200).send({ error: 'Error loading feature models' });
    }
}

const listByUser = async (req, res) => {
    try {
        const returnedFeatureModel = await featureModel.find({user: req.userId});

        return res.status(200).send({ returnedFeatureModel });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading feature model' });
    }
}

const get = async (req, res) => {
    try {
        const returnedFeatureModel = await featureModel.findById(req.params.featureModelId);

        return res.status(200).send({ returnedFeatureModel });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading feature model' });
    }
}

const update = async (req, res) => {
    try {
        const updatedFeatureModel = await featureModel.findByIdAndUpdate(req.params.featureModelId, {
            ...req.body,
            user: req.userId,
        }, { new: true });

        return res.status(200).send({ updatedFeatureModel });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating new feature model' });
    }
}

const remove = async (req, res) => {
    try {
        await featureModel.findByIdAndDelete(req.params.featureModelId);

        return res.status(200).send({ message: 'Feature model has removed' });
    } catch (err) {
        return res.status(400).send({ error: 'Error removing feature model' });
    }
}

module.exports = { create, list, get, listByUser, update, remove };
