const DOMParser = require("xmldom").DOMParser;
const numberOfFeatures = require("../core/qualitymeasures/numberOfFeatures");

exports.post = async (req, res) => {
    let json = convertXMLToJson(req.body.xmlString);
    const fModel = JSON.parse(json);
    let number_of_features = await numberOfFeatures.execute(fModel)
    res.status(200).send(JSON.stringify({...fModel, number_of_features}));
};

/* convert the XML document to json */
convertXMLToJson = (data) => {
    let json = {};
    let document = new DOMParser().parseFromString(data, "text/xml");

    // name of feature model
    let featureModelName = document
        .getElementsByTagName("feature_model")[0]
        .getAttribute("name");
    json["name"] = featureModelName;

    // meta of feature model
    let featureModelMeta = document.getElementsByTagName("data");
    for (index = 0; index < featureModelMeta.length; index++) {
        let dataName = featureModelMeta[index].getAttribute("name");
        let dataContent = featureModelMeta[index].textContent;
        json[dataName] = dataContent;
    }

    // tree
    let treeString = document.getElementsByTagName("feature_tree")[0]
        .textContent;
    let tree = generateTree(treeString, 1);
    json["feature_tree"] = [tree];

    // constraints
    let constraintsString = document.getElementsByTagName("constraints")[0]
        .textContent;
    let constraints = generateConstraints(constraintsString);
    json["constraints"] = constraints;

    // contexts
    let contextElements = document.getElementsByTagName("context");
    let contexts = generateContexts(contextElements);
    json["contexts"] = contexts;

    return JSON.stringify(json);
};

/* creates individual tree nodes from a string */
generateNode = (nodeString) => {
    let id, type, name, multiplicity, children, nodeDepth;

    /* id */
    id = nodeString.substring(
        nodeString.indexOf("(") + 1,
        nodeString.indexOf(")")
    );

    /* type */
    type = nodeString.substring(
        nodeString.indexOf(":") + 1,
        nodeString.indexOf(":") + 2
    );

    if (type == " ") {
        type = "";
    }

    /* name */
    if (type == "") {
        name = nodeString.substring(
            nodeString.indexOf(":") + 2,
            nodeString.indexOf("(")
        );
    } else {
        name = nodeString.substring(
            nodeString.indexOf(":") + 3,
            nodeString.indexOf("(")
        );
    }

    /* children */
    children = [];

    /* multiplicity */
    if (type == "g") {
        multiplicity = nodeString.substring(
            nodeString.indexOf("[") + 1,
            nodeString.indexOf("]")
        );
    }

    const depth = nodeString.match(/\t/g);
    nodeDepth = depth ? depth.length : 0;

    /* return object */
    if (type == "g") {
        return { id, type, multiplicity, name, children, nodeDepth };
    } else {
        return { id, type, name, children, nodeDepth };
    }
};

function getRootNode(treeString) {
    const rows = treeString.split("\n");

    for (let i = 0; i < rows.length; i++) {
        if (rows[i] === "") rows.splice(i, 1);
    }

    return rows[0];
}

function organizeTreeNodes(treeNodes) {
    const rootNode = treeNodes[0];

    if (treeNodes.length > 1) {
        let children = [];
        let lastIndex = treeNodes.length - 1;

        for (let i = lastIndex; i >= 1; i--) {
            let node = treeNodes[i];

            if (rootNode.nodeDepth + 1 === node.nodeDepth) {
                children.push({ start: i, end: lastIndex + 1 });

                lastIndex = i - 1;
            }
        }

        while (children.length > 0) {
            let element = children.pop();

            rootNode.children.push(
                organizeTreeNodes(treeNodes.slice(element.start, element.end))
            );
        }
    }

    return rootNode;
}

function generateTree(treeString) {
    const treeStringRows = treeString.split("\n");
    const treeNodes = [];

    for (let i = 0; i < treeStringRows.length; i++) {
        const row = treeStringRows[i];

        if (row.trim() !== "") {
            const node = generateNode(row);

            treeNodes.push(node);
        }
    }

    const rootNode = organizeTreeNodes(treeNodes);

    return rootNode;
}

/* creates constraints based on a string */
generateConstraints = (constraintsString) => {
    let constraintsArray = constraintsString.split("\n");
    let constraints = [];

    for (index in constraintsArray) {
        let item = constraintsArray[index];

        if (item !== "") {
            let constraint = {};
            let name = item.substring(0, item.indexOf(":"));
            let value = item.substring(item.indexOf(":") + 1, item.length);
            constraint["name"] = name;
            constraint["value"] = value;
            constraints.push(constraint);
        }
    }

    return constraints;
};

/* create a set of contexts */
generateContexts = (contextElements) => {
    let contexts = [];

    for (let index = 0; index < contextElements.length; index++) {
        contexts.push(generateContext(contextElements[index]));
    }

    return contexts;
};

/* create a context */
generateContext = (contextElement) => {
    let context = {
        name: contextElement.getAttribute("name"),
        resolutions: [],
        constraints: [],
        isTheCurrent: false,
    };

    // resolutions
    let resolutions = contextElement.getElementsByTagName("resolution");
    for (let index = 0; index < resolutions.length; index++) {
        let resolution = {};
        resolution["feature_id"] = resolutions[index].getAttribute("id");
        resolution["feature_name"] = resolutions[index].getAttribute("feature");
        resolution["status"] =
            resolutions[index].getAttribute("status") === "true";
        context.resolutions.push(resolution);
    }

    // constraints
    let contextConstraints = contextElement.getElementsByTagName("constraints");
    if (
        contextConstraints.length !== 0 &&
        contextConstraints[0].textContent !== ""
    ) {
        context.constraints = generateConstraints(
            contextConstraints[0].textContent
        );
    }

    return context;
};
