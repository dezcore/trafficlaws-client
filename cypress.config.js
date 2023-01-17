const { defineConfig } = require("cypress");

//load the environment variables from the local .env file
require('dotenv').config()

module.exports = defineConfig({
  env: {
    'my-var': 'ok',
    auth_username: process.env.VUE_APP_USERNAME,
    auth_password: process.env.VUE_APP_PASSWORD,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
    googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET
  },
  //"chromeWebSecurity": false,
  e2e: {
    baseUrl: 'http://localhost:8080',
    //"chromeWebSecurity": false,
    //defaultCommandTimeout: 25000,
    //experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // we can grab some process environment variables
      // and stick it into config.env before returning the updated config
      config.env = config.env || {}

      // you could extract only specific variables
      // and rename them if necessary
      
      //Api
      config.env.VUE_APP_API_ORIGN = process.env.VUE_APP_API_ORIGN
      config.env.VUE_APP_API_ROOT = process.env.VUE_APP_API_ROOT
      config.env.VUE_APP_API_URL = process.env.VUE_APP_API_URL
      config.env.VUE_APP_CODE_URL = process.env.VUE_APP_CODE_URL

      //Google
      config.env.VUE_APP_LOADCLIENTURL = process.env.VUE_APP_LOADCLIENTUR
      config.env.VUE_APP_CLIENTID = process.env.VUE_APP_CLIENTID 
      config.env.VUE_APP_APIKEYS = process.env.VUE_APP_APIKEYS

      //Google Drive
      config.env.VUE_APP_DRIVE_FOLDER = process.env.VUE_APP_DRIVE_FOLDER
      config.env.VUE_APP_SCOPE = process.env.VUE_APP_SCOPE
      config.env.VUE_APP_DRIVE_DOWNLOAD = process.env.VUE_APP_DRIVE_DOWNLOAD
      config.env.VUE_APP_SCOPES = process.env.VUE_APP_SCOPES

      return config
    },
  },
});
