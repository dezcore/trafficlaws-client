function getPublicPath() {
  switch (process.env.NODE_ENV) {
    case 'production': return '/applications/' 
    default: return '/'
  }
}

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: getPublicPath()
}