const fs = require("fs");
const tmp = require("tmp");

exports.post = (req, res) => {
    const { featureModel, withContexts } = req.body;

    const featureModelStr = convertJsonToXML(featureModel, withContexts);

    const { name: fileName } = tmp.fileSync({
        prefix: "feature-model",
        postfix: ".xml",
    });

    fs.writeFileSync(fileName, featureModelStr);

    return res.download(fileName);
};

function convertJsonToXML(featureModel, withContexts) {
    const {
        name,
        description,
        creator,
        address,
        email,
        phone,
        website,
        organization,
        department,
        date,
        reference,
        feature_tree,
        constraints,
        contexts,
    } = featureModel;
    const [featureTree] = feature_tree;

    return `
        <feature_model name="${name}">
            <meta>
                <data name="description">${description}</data>
                <data name="creator">${creator}</data>
                <data name="address">${address}</data>
                <data name="email">${email}</data>
                <data name="phone">${phone}</data>
                <data name="website">${website}</data>
                <data name="organization">${organization}</data>
                <data name="department">${department}</data>
                <data name="date">${date}</data>
                <data name="reference">${reference}</data>
            </meta>
            <feature_tree>
${generateFeatureTreeStr(featureTree)}
            </feature_tree>
            <constraints>
${generateConstraintsStr(constraints)}
            </constraints>
${withContexts ? generateContextsStr(contexts) : ""}
        </feature_model>
    `;
}

function generateFeatureTreeStr(featureTree) {
    let str = `${"\t".repeat(featureTree.nodeDepth + 3)}:${featureTree.type} ${
        featureTree.name
    }(${featureTree.id})\n`;

    featureTree.children.forEach((element) => {
        str += generateFeatureTreeStr(element);
    });

    return str;
}

function generateConstraintsStr(constraints) {
    let str = "";

    constraints.forEach((element) => {
        str += `${"\t".repeat(3)}${element.name}:${element.value}\n`;
    });

    return str;
}

function generateContextsStr(contexts) {
    let str = "";

    contexts.forEach((element) => {
        str += `
            <context name="${element.name}">
${generateContextResolutionsStr(element.resolutions)}
${generateContextConstraintsStr(element.constraints)}
            </context>\n
        `;
    });

    return str;
}

function generateContextResolutionsStr(resolutions) {
    let str = "";

    resolutions.forEach((element) => {
        str += `<resolution feature="${element.feature_name}" id="${element.feature_id}" status="${element.status}"/>\n`;
    });

    return str;
}

function generateContextConstraintsStr(constraints) {
    let str = "";

    constraints.forEach((element) => {
        str += `<constraint>${element}</constraint>\n`;
    });

    return str;
}
