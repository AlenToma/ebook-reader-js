const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'ebookreaderjs.js',
        path: path.resolve(__dirname, 'single'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpe?g|png|ttf|eot|svg|otf|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: [{
                    loader: 'base64-inline-loader'
                }],
                type: 'javascript/auto'
            },
        ],
    },
};