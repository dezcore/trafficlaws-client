let access_token, client, tokenClient

function authenticate() {
    return window.google.accounts.oauth2.getAuthInstance()
        .signIn()
        .then((googleUser) => { console.log("Sign-in successful : ", googleUser);})
}

function loadClient(callBack) {
    const keys = process.env.VUE_APP_APIKEYS.split(", ")

    if(keys) {
        window.gapi.load('client', () => {
            window.gapi.client.setApiKey(keys[0])
            return  window.gapi.client.load(process.env.VUE_APP_LOADCLIENTURL)
            .then(function() { 
                if(callBack)
                    callBack("GAPI client loaded for API") 
            },
            function(err) { console.error("Error loading GAPI client for API", err);});
        })
    }
}

//Make sure the client is loaded and sign-in is complete before calling this method.
function execute(part, channelId, q, type, pageToken, callBack) {
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
        client_id: process.env.VUE_APP_CLIENTID,
        scope: process.env.VUE_APP_SCOPES,
        ux_mode: 'popup',
        callback: (response) => {
          if(response.access_token)
              access_token = response.access_token
        }
    })
}

function initCodeClient() {
    client = window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.VUE_APP_CLIENTID,
      scope: process.env.VUE_APP_SCOPES,
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
    const credential = window.App.$store.state.trafficlawstore.credential

    if(credential) {
        window.google.accounts.id.revoke(credential.sub, (response) => {
            if(response) {
                window.localStorage.setItem('credential', null)
                window.App.$store.commit("updateCredential" , null)
                //window.location.replace('/')
            }
        })
    }
}

function handleCredentialResponse(response) {
    if(response) {
        window.localStorage.setItem('credential', response.credential)
        window.App.$store.commit("updateCredential" , response.credential)
        window.location.replace('/')
    }
}

function initAuth() {
    window.google.accounts.id.initialize({
        client_id: process.env.VUE_APP_CLIENTID,
        callback: handleCredentialResponse
    })
   // window.google.accounts.id.prompt() // also display the One Tap dialog
}

window.onload = function () {
    initCodeClient()
    initTokenClient()
    initAuth()
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