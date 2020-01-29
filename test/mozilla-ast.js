// Testing UglifyJS <-> SpiderMonkey AST conversion
// through generative testing.

var UglifyJS = require(".."),
    escodegen = require("escodegen"),
    estraverse = require("estraverse"),
    prefix = Array(20).join("\b") + "    ";

// Normalizes input AST for UglifyJS in order to get correct comparison.

function normalizeInput(ast) {
    return estraverse.replace(ast, {
        enter: function(node, parent) {
            switch (node.type) {
                // Internally mark all the properties with semi-standard type "Property".
                case "ObjectExpression":
                    node.properties.forEach(function (property) {
                        property.type = "Property";
                    });
                    break;

                // Since UglifyJS doesn"t recognize different types of property keys,
                // decision on SpiderMonkey node type is based on check whether key
                // can be valid identifier or not - so we do in input AST.
                case "Property":
                    var key = node.key;
                    if (key.type === "Literal" && typeof key.value === "string" && UglifyJS.is_identifier(key.value)) {
                        node.key = {
                            type: "Identifier",
                            name: key.value
                        };
                    } else if (key.type === "Identifier" && !UglifyJS.is_identifier(key.name)) {
                        node.key = {
                            type: "Literal",
                            value: key.name
                        };
                    }
                    break;

                // UglifyJS internally flattens all the expression sequences - either
                // to one element (if sequence contains only one element) or flat list.
                case "SequenceExpression":
                    node.expressions = node.expressions.reduce(function flatten(list, expr) {
                        return list.concat(expr.type === "SequenceExpression" ? expr.expressions.reduce(flatten, []) : [expr]);
                    }, []);
                    if (node.expressions.length === 1) {
                        return node.expressions[0];
                    }
                    break;
            }
        }
    });
}
