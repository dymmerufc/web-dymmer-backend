const mongoose = require('../database/index');

const featureModelSchema = new mongoose.Schema({
    featureModelJson: {
        type: String,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
        default: false,
    },
    user: {
        type: String,
        default: "",
    },
    allowEdit: {
        type: Boolean,
        default: true,
    },
    useInThresholds: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FeatureModel = mongoose.model('FeatureModel', featureModelSchema);

module.exports = FeatureModel;
