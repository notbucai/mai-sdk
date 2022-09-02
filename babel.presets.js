module.exports = {
  getPresetsEnv (isModule = true) {
    return [
      '@babel/preset-env', {
        modules: isModule ? 'auto' : false
      }
    ]
  }
}
