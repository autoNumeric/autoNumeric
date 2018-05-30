module.exports = {
    env          : {
        browser: true,
        es6    : true,
    },
    globals      : {
        module : true,
        require: true,
    },
    extends      : 'eslint:recommended',
    parserOptions: {
        sourceType : 'module',
        ecmaVersion: 2017,
    },
    rules        : {
        // Basic rules
        indent                         : [
            'error',
            4,
            {
                SwitchCase         : 1,
                VariableDeclarator : {
                    var  : 1,
                    let  : 1,
                    const: 1,
                },
                outerIIFEBody      : 0,
                MemberExpression   : 1,
                FunctionDeclaration: {
                    parameters: 'first',
                },
                FunctionExpression : {
                    parameters: 'first',
                },
                CallExpression     : {
                    arguments: 'first',
                },
            },
        ],
        'object-property-newline'      : [
            'error',
            {
                'allowAllPropertiesOnSameLine': true,
            },
        ],
        'object-curly-newline'         : [
            'error',
            {
                'ObjectExpression' : { 'multiline': true, 'consistent': true },
                'ObjectPattern'    : { 'multiline': true },
                'ImportDeclaration': { 'multiline': true, 'minProperties': 2 },
                'ExportDeclaration': { 'multiline': true, 'minProperties': 2 },
            },
        ],
        'keyword-spacing'              : [
            'error',
            {
                before: true,
                after : true,
            },
        ],
        // Do not use "space-infix-ops": "error", for ternary operators
        'arrow-spacing'                : [
            'error',
            {
                before: true,
                after : true,
            },
        ],
        'arrow-parens'                 : [
            'error',
            'as-needed',
        ],
        'arrow-body-style'             : [
            'error',
            'as-needed',
            {
                requireReturnForObjectLiteral: false
            },
        ],
        'no-confusing-arrow'           : 'error',
        'no-unexpected-multiline'      : 'error',
        'space-before-function-paren'  : [
            'error',
            {
                anonymous : 'never',
                named     : 'never',
                asyncArrow: 'always',
            },
        ],
        'space-before-blocks'          : 'error',
        'linebreak-style'              : [
            'error',
            'unix',
        ],
        'newline-per-chained-call'     : [
            'error',
            {
                ignoreChainWithDepth: 2,
            }
        ],
        'object-curly-spacing'         : [
            'error',
            'always',
        ],
        'array-bracket-spacing'        : [
            'error',
            'never',
        ],
        'no-whitespace-before-property': 'error',
        'padded-blocks'                : [
            'error',
            'never',
        ],
        'space-in-parens'              : [
            'error',
            'never',
        ],
        camelcase                      : [
            'error',
            {
                properties: 'always',
            },
        ],
        'new-cap'                      : 'error',
        'no-underscore-dangle'         : 0,
        quotes                         : [
            'error',
            'single', // Backticks are allowed due to substitution
            {
                allowTemplateLiterals: true,
                avoidEscape          : true,
            },
        ],
        semi                           : [
            'error',
            'always',
        ],
        'semi-spacing'                 : 'error',
        curly                          : [
            'error',
            'multi-line',
            'consistent',
        ],
        'prefer-const'                 : 'error',
        'no-const-assign'              : 'error',
        'no-var'                       : 'error',
        'no-new-object'                : 'error',
        'object-shorthand'             : 'error',
        'quote-props'                  : [
            'error',
            'as-needed',
        ],
        'no-array-constructor'         : 'error',
        'func-style'                   : [
            'error',
            'declaration',
            {
                allowArrowFunctions: true,
            },
        ],
        'no-loop-func'                 : 'error',
        'no-new-func'                  : 'error',
        'prefer-spread'                : 'error',
        'prefer-arrow-callback'        : 'error',
        'no-useless-constructor'       : 'error',
        'no-dupe-class-members'        : 'error',
        'no-duplicate-imports'         : [
            'error',
            {
                includeExports: true,
            },
        ],
        'no-func-assign'               : 'error',
        'no-class-assign'              : 'error',
        'no-iterator'                  : 'error',
        'dot-notation'                 : 'error',
        'no-undef'                     : 'error',
        'one-var'                      : [
            'error',
            'never',
        ],
        radix                          : [
            'error',
            'always',
        ],

        // Other misc rules
        'no-unneeded-ternary'   : 'error',
        'no-nested-ternary'     : 'error',
        'no-unreachable'        : 'error',
        'use-isnan'             : 'error',
        'no-unsafe-negation'    : 'error',
        'no-extra-semi'         : 'error',
        'no-sparse-arrays'      : 'error',
        'no-eq-null'            : 'error',
        eqeqeq                  : 'error',
        'no-eval'               : 'error',
        strict                  : [
            'error',
            'safe',
        ],
        'no-useless-escape'     : 'error',
        'prefer-rest-params'    : 'error',
        'generator-star-spacing': [
            'error',
            {
                before: false,
                after : true,
            }
        ],
        'no-case-declarations'  : 'error',
        'spaced-comment'        : [
            'error',
            'always',
            {
                line : {
                    markers   : ['/', 'TODO', 'FIXME', 'DEBUG', 'XXX'],
                    exceptions: ['-', '+', 'TODO', 'FIXME', 'DEBUG', 'XXX'],
                },
                block: {
                    markers   : ['!'],
                    exceptions: ['*'],
                    balanced  : true,
                }
            }
        ],
        'eol-last'              : [
            'error',
            'always',
        ],
        'comma-style'           : [
            'error',
            'last',
        ],
        'comma-dangle'          : [
            'error',
            'always-multiline',
        ],

        // allow debugger during development
        'no-debugger': (process.env.NODE_ENV === 'production')?2:0,

        'valid-jsdoc'    : [
            'error', {
                prefer                  : {
                    arg     : 'param',
                    argument: 'param',
                    class   : 'constructor',
                    return  : 'returns',
                    virtual : 'abstract',
                },
                requireReturn           : false,
                requireParamDescription : false, //TODO Ideally, this should be set to true
                requireReturnDescription: false, //TODO Ideally, this should be set to true
            }
        ],
        //TODO This should really be enabled by default :
        'no-invalid-this': 'error',
        'wrap-iife'      : [
            'error',
            'inside'
        ],
        /*'yoda'           : [
            'error',
            'always',
            {
                'onlyEquality': true,
            },
        ],*/
        // "no-param-reassign"              : "error",
        // "import/prefer-default-export"   : "error",
        // "import/first"                   : "error",
        // "import/no-webpack-loader-syntax": "error",
    },
};
