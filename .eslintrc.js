module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        // Basic rules
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "VariableDeclarator": {
                    "var": 1,
                    "let": 1,
                    "const": 1
                },
                "outerIIFEBody": 0,
                "MemberExpression": 1,
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "parameters": "first"
                },
                "CallExpression": {
                    "arguments": "first"
                },
            }
        ],
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true,
            },
        ],
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "never",
                "named": "never",
                "asyncArrow": "always"
            },
        ],
        "linebreak-style": [
            "error",
            "unix",
        ],
        "quotes": [
            "error",
            "single", //Backticks are allowed due to substitution
            {
                "allowTemplateLiterals": true,
                "avoidEscape": true,
            },
        ],
        "semi": [
            "error",
            "always",
        ],
        "semi-spacing": "error",
        "curly": "error",

        // Other misc rules
        "no-unneeded-ternary": "error",
        "no-nested-ternary": "error",
        "no-unreachable": "error",
        "use-isnan": "error",
        "no-unsafe-negation": "error",
        "no-extra-semi": "error",
        "no-sparse-arrays": "error",
        "no-eq-null": "error",
        "eqeqeq": "error",
        "no-eval": "error",
        "strict": [
                "error",
                "safe"
        ],
        // allow debugger during development
        'no-debugger': (process.env.NODE_ENV === 'production')?2:0,
        //TODO This should really be enabled
        // "valid-jsdoc": "error",
        /*"yoda": [
            "error",
            "always",
            {
                "onlyEquality": true,
            },
        ],*/
    }
};
