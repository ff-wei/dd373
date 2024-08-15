module.exports = {
    plugins: {
        'postcss-px-to-viewport': {
            viewportWidth: 750,
            exclude: [/node_modules/],
        },
    }
}
