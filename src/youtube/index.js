//import jwt_decode from "jwt-decode"

let user
let access_token, client, tokenClient

//const API_KEY = "AIzaSyA4oti9VxSGxLfcF7uNk4flp2WpGirVU8s"
const SCOPES =  'https://www.googleapis.com/auth/drive.metadata.readonly'

                /*const SCOPES =  'https://www.googleapis.com/auth/calendar.readonly \
                https://www.googleapis.com/auth/contacts.readonly \
                https://www.googleapis.com/auth/drive.metadata.readonly'*/
                        
const APIKEYS = [
    "AIzaSyA4oti9VxSGxLfcF7uNk4flp2WpGirVU8s",
    "AIzaSyCwqr9o5EcrDfnMxFBrbXnfA4uLXOoxw9w"
]

const loadClientUrl = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
const CLIENT_ID = "375759355990-lcmv43je7208j27lg3t7ce68p7m7sjn4.apps.googleusercontent.com"


function authenticate() {
    return window.google.accounts.oauth2.getAuthInstance()
        .signIn()
        .then((googleUser) => { console.log("Sign-in successful : ", googleUser);})
}

function loadClient(callBack) {
    window.gapi.load('client', () => {
        window.gapi.client.setApiKey(APIKEYS[0])
        return  window.gapi.client.load(loadClientUrl)
        .then(function() { 
            if(callBack)
                callBack("GAPI client loaded for API") 
        },
        function(err) { console.error("Error loading GAPI client for API", err);});
    })
}

//Make sure the client is loaded and sign-in is complete before calling this method.
function execute(part, channelId, q, type, pageToken, callBack) {
    //pageToken
    return  window.gapi.client.youtube.search.list({
        "channelId" : channelId,
        "part": part,
        "q": q,
        "type": type,
        "pageToken" : pageToken
    })

    .then(function(response) {
        if(callBack && response.result)
            callBack(response.result)
    },
    function(err) { console.error("Execute error", err); })
}

function initTokenClient() {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        ux_mode: 'popup',
        callback: (response) => {
          if(response.access_token)
              access_token = response.access_token
        }
      })
}

function initCodeClient() {
    client = window.google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      ux_mode: 'popup',
      callback: (response) => {
        if(response.code) {
            console.log("response : ", response)
        }

        /*let code_receiver_uri = 'http://localhost:3000'
        // Send auth code to your backend platform
        const xhr = new XMLHttpRequest()
        xhr.open('POST', code_receiver_uri, true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhr.onload = function() {
          console.log('Signed in as: ' + xhr.responseText);
        }
        xhr.send('code=' + code)*/
      }
    })
}

function getAuthCode() {
    // Request authorization code and obtain user consent
    client.requestCode();
}

function getToken() {
    tokenClient.requestAccessToken();
}

function revokeToken() {
    window.google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')})
}

function loadCalendar() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.googleapis.com/calendar/v3/calendars/primary/events')
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token)
    xhr.send();
}

function signOut() {
    if(user) {
        window.google.accounts.id.revoke(user.email, (response) => {
            console.log("user : ", response)
        })
    }
}

window.onload = function () {
    initCodeClient()
    initTokenClient()
}

export {
    signOut,
    execute,
    getToken,
    loadClient,
    revokeToken,
    getAuthCode,
    authenticate,
    loadCalendar,
}