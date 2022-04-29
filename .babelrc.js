module.exports = {
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs']
  //   env: {
  //     test: {
  //       // Make jest not angry when we use fancy features, not a problem for users because they'll be bundling our lib anyways
  //     }
  //   }
}
