exports.execute = async (featureModel) => {
    let featureTree = featureModel.feature_tree[0];

    return await numberOfOptionalFeatures(featureTree);
}

const numberOfOptionalFeatures = async (featureTree) => {
    let response = 0;

    if (featureTree.children) {
        for (let i = 0; i < featureTree.children.length; i++) {
            if (featureTree.children[i].type == 'o')
                response += await numberOfOptionalFeatures(featureTree.children[i]) + 1;
            else
                response += await numberOfOptionalFeatures(featureTree.children[i]);
        }
    }

    return response;
}
