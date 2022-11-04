/*let client
let access_token
//const API_KEY = "AIzaSyA4oti9VxSGxLfcF7uNk4flp2WpGirVU8s"
const SCOPES =  'https://www.googleapis.com/auth/calendar.readonly \
                https://www.googleapis.com/auth/drive.metadata.readonly'
const CLIENT_ID = "375759355990-lcmv43je7208j27lg3t7ce68p7m7sjn4.apps.googleusercontent.com"

function initClient() {
    client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        console.log("tokenResponse : ", tokenResponse)
        access_token = tokenResponse.access_token
      },
    })
}

function getToken() {
    client.requestAccessToken()
}

function revokeToken() {
    window.google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')})
}

function loadCalendar() {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://www.googleapis.com/calendar/v3/calendars/primary/events')
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token)
    xhr.send()
}

window.onload = function () {
    initClient()
}

export {
    initClient,
    getToken,
    revokeToken,
    loadCalendar
}*/