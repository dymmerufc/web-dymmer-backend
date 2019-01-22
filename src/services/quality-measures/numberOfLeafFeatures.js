exports.numberOfLeafFeatures = async (featureModel) => {
    let featureTree = featureModel.feature_tree;

    return countNumberOfLeafFeatures(featureTree);
}

countNumberOfLeafFeatures = (featureTree) => {
    let numberOfLeafFeatures = 0;

    if (featureTree.children.length === 0) {
        numberOfLeafFeatures += 1;
    } else {
        featureTree.children.forEach(node => {
            numberOfLeafFeatures += countNumberOfLeafFeatures(node);
        });
    }

    return numberOfLeafFeatures;
}