/* global module */

module.exports = {
    entry: './src/main.js',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(bower_components|node_modules)/,

            // cf. chained loaders : http://webpack.github.io/docs/loaders.html#introduction
            loader: 'imports?this=>window!babel',
        }],
    },
    output: {
        libraryTarget: 'umd',
        library: 'AutoNumeric',
    },
    resolve: {
        extensions: [
            '',
            '.js',
        ],
    },
    /*externals: {
        // cf. http://webpack.github.io/docs/library-and-externals.html#applications-and-externals
        // and http://webpack.github.io/docs/configuration.html#externals
    },*/
};
