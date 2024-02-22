// src/services/dataService/nodeTreeService.js
import _ from 'lodash';

/**
 * Parses a Linear Tree structure to NodeTree Structure.
 * The parent attribute will be set according to parentAttribute argument
 * @param {Array} data Array of Nodes
 * @returns {Object} NodeTree from Array
 */
export function treeParser(data, parentAttribute = 'pid') {
    return new Promise((resolve, reject) => {
        try {
            let check = _.keyBy(data, function (o) {
                return o.id;
            });
            data.map((item) => {
                if (
                    item[parentAttribute] &&
                    'children' in check[item[parentAttribute]]
                ) {
                    check[item[parentAttribute]].children.push(item);
                } else if (item[parentAttribute]) {
                    check[item[parentAttribute]].children = [item];
                } else {
                    item.children = [];
                }
            });

            resolve(check[Object.keys(check)[0]]);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Generates an Array of Nodes for the Org Chart
 * @param {int} nodes Number of nodes to generate
 * @returns {Array} Tree Nodes Array
 */
export function treeGeneratorUtil(nodes = 5000) {
    return new Promise((resolve, reject) => {
        try {
            let items = [];
            let titles = [
                'Accountant',
                'Engineer',
                'Doctor',
                'Teacher',
                'Nurse',
                'Driver',
                'Cook',
                'Guard',
                'Cleaner',
                'Clerk',
            ]; // ? Add more titles if needed

            for (let i = 0; i < nodes; i++) {
                // ? Sample Object
                let item = {
                    id: 980 + i,
                    title: titles[Math.floor(Math.random() * titles.length)],
                    pid:
                        i === 0
                            ? null
                            : items[Math.floor(Math.random() * i)].id,
                    globalUserId: '652fe97b40739536088b3b46',
                    name: 'GUS1 MICHOS',
                    email: 'GUSMICHOS@YOPMAIL.COM',
                    profileImage: '/img/user_info.png',
                    status: 1,
                    departmentId: 42,
                    departmentName: 'IT',
                    color: '#1AA59A',
                };
                items.push(item);
            }
            resolve(items);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Returns the Node Array upto a specified depth
 * @param {Object} data Node Array
 * @param {int} level Level upto which you want to extract
 * @param {any} parentId Parent Id to look for, this is used for recursion
 * @param {any} parentAttribute Attribute that holds the parent ID
 * @param {int} currentLevel The current level of the Node, This is used for recursion ony
 * @returns {Array} Filtered Tree
 */
export function fetchDepthLinear(
    data,
    level,
    parentId = null,
    parentAttribute = 'pid',
    currentLevel = 1,
) {
    return new Promise((resolve, reject) => {
        try {
            if (currentLevel > level) {
                return [];
            }

            const result = [];

            for (const node of data) {
                if (node[parentAttribute] === parentId) {
                    const children = fetchDepthLinear(
                        data,
                        level,
                        node.id,
                        parentAttribute,
                        currentLevel + 1,
                    );
                    result.push(node, ...children);
                }
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Returns the NodeTree upto a specified depth
 * @param {Object} node Root Node
 * @param {int} level Level upto which you want to extract
 * @param {int} currentLevel The current level of the Node, This is used for recursion ony
 * @returns {Object} Filtered NodeTree
 */
export function fetchDepth(node, level, currentLevel = 1) {
    return new Promise((resolve, reject) => {
        try {
            // ? If no Node is passed return null
            if (!node) {
                return null;
            }

            // ? if the depth limit is reached return everything
            // ? except the children
            if (currentLevel == level) {
                return { label: node.label };
            }

            // ? create a holder for the new subtree
            const subtree = { label: node.label, children: [] };

            // ? if the current node has children
            // ! i.e. the currentNode is not a leaf node
            if (node.children) {
                // ? For each child of the node
                node.children.forEach((child) => {
                    // ? Recurse the depth fetch on the child node and indicate that the level has increased
                    let childSubTree = fetchDepth(
                        child,
                        level,
                        currentLevel + 1,
                    );

                    // ? After the recursion if a child exist push the node
                    if (childSubTree) {
                        subtree.children.push(childSubTree);
                    }
                });
            }

            resolve(subtree);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Calculates the depth of the NodeTree
 * @param {Object} node Root Node
 * @param {int} currentDepth The current depth of calculation used for recursion
 * @returns {int} depth
 */
export function depthCalculator(node, currentDepth = 1) {
    return new Promise((resolve, reject) => {
        try {
            // ? if the node does not have any child return the current depth
            if (!node.children) {
                return currentDepth;
            }

            // ? New depth calculated form the children
            let newDepth = 0;

            node.children.forEach((child) => {
                // ? Depth of current child
                let temp = depthCalculator(child, currentDepth + 1);
                // ? if the depth of this child is greater than previous one
                if (temp > newDepth) {
                    newDepth = temp;
                }
            });

            // ? New Depth
            resolve(newDepth);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Calculates the depth of the node array
 * @param {Array]} data Array of nodes
 * @param {any} parentId Id of Parent
 * @returns
 */
export function depthCalculatorLinear(data, parentId = null) {
    return new Promise((resolve, reject) => {
        try {
            let maxDepth = 0;

            for (const node of data) {
                if (node.pid === parentId) {
                    const depth = 1 + depthCalculatorLinear(data, node.id);
                    maxDepth = Math.max(maxDepth, depth);
                }
            }

            resolve(maxDepth);
        } catch (e) {
            reject(e);
        }
    });
}
