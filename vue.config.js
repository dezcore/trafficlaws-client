function getPublicPath() {
  switch (process.env.NODE_ENV) {
    case 'production': return '/trafficlaws-client/' 
    default: return '/'
  }
}

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: getPublicPath()
}