module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "./public/js/bundle.js"
    },
    devtool: "inline-source-map",
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader'},
            { test: /\.js$/, exclude: /node_modules/, loader: "babel",
                query: {
                    presets: ["es2015", "react"],
                }
            }
        ]
    }
}