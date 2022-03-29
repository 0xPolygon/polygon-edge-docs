module.exports = function(api){
    if (api.env("test")) {
        return {
            presets: ["@babel/preset-env"],
        }
    }
    return {
        presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    }
};
