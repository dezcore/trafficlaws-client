import apiMixin from '../mixins/apiMixin'

let access_token, client, tokenClient
const userInfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'

function authenticate() {
    return window.google.accounts.oauth2.getAuthInstance()
        .signIn()
        .then((googleUser) => { console.log("Sign-in successful : ", googleUser);})
}

function yKeysHandler(index, err, defaultIndex, callBack) {
    const currentIndex = index !== undefined ? index : 0
    const keyIndex = defaultIndex ? currentIndex : currentIndex + 1 
    const keys = process.env.VUE_APP_APIKEYS.split(", ")
    let currentKey = keys[keyIndex]

    if(err)
        console.error("Execute error", err)

    if(currentKey && window.gapi.client) {
        window.gapi.client.setApiKey(currentKey)

        if(callBack)
            callBack(keyIndex)

    } else if(callBack) {
        callBack(-1)
    }
}

function loadClient(callBack) {
    yKeysHandler(0, null, true, () => {
        window.gapi.load('client', () => {
            return  window.gapi.client.load(process.env.VUE_APP_LOADCLIENTURL)
            .then(function() { 
                if(callBack)
                    callBack("GAPI client loaded for API") 
            },
            function(err) { console.error("Error loading GAPI client for API", err);});
        })
    }) 
}

//Make sure the client is loaded and sign-in is complete before calling this method.
function execute(part, channelId, q, type, pageToken, callBack, keyIndex) {
    window.gapi.client.youtube.search.list({
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
    function(err) {
        if(err.status === 403) {
            yKeysHandler(keyIndex , err, false, (keyNewIndex) => {
                if(keyNewIndex !== -1) {
                    execute(part, channelId, q, type, pageToken, callBack, keyNewIndex)
                }
            })
        }
    })
}

function executeByFilter(parameters, callBack, keyIndex) {
    let yParameters
    const {part, channelId, q, type, pageToken, maxResult, order, publishedAfter} = parameters

    yParameters = {
        "channelId" : channelId,
        "part": part,
        "q": q ? q : "",
        "type": type,
        "maxResults" : maxResult ? maxResult : 10,
        "order": order ? order : "date" , //viewCount
        "pageToken" : pageToken ? pageToken : null
    }

    if(publishedAfter)
        yParameters.publishedAfter = publishedAfter

    window.gapi.client.youtube.search.list(yParameters)
    .then(function(response) {
        if(callBack && response.result)
            callBack(response.result)
    },
    function(err) {        
        if(err.status === 403) {
            yKeysHandler(keyIndex , err, false, (keyNewIndex) => {
                if(keyNewIndex !== -1)
                    executeByFilter(parameters, callBack, keyNewIndex)
            })
        }
    })
}

function toHHMMSS(secs) {
    let sec_num = parseInt(secs, 10)
    let hours   = Math.floor(sec_num / 3600)
    let minutes = Math.floor(sec_num / 60) % 60
    let seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

function apiDurationToDate(input) {
    let res
    let reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0, minutes = 0, seconds = 0, totalseconds;

    if(reptms.test(input)) {
        let matches = reptms.exec(input);
        if(matches[1]) hours = Number(matches[1]);
        if(matches[2]) minutes = Number(matches[2]);
        if(matches[3]) seconds = Number(matches[3]);
        totalseconds = hours * 3600  + minutes * 60 + seconds;
        res = toHHMMSS(totalseconds-1)
    } else {
        res = toHHMMSS(0)
    }
    return res
}

function getVideosData(videosId, part, callBack, keyIndex) {

    window.gapi.client.youtube.videos.list({
        "id" : videosId,
        "part": part,
    })
    .then(function(response) {
        if(callBack && response.result)
            callBack(response.result)
    },
    function(err) {
        if(err.status === 403) {
            yKeysHandler(keyIndex, err, false, (keyNewIndex) => {
                if(keyNewIndex !== -1)
                    getVideosData(videosId, part, callBack, keyNewIndex)
            })
        }
    })
}

function initTokenClient() {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.VUE_APP_CLIENTID,
        scope: process.env.VUE_APP_SCOPE,
        ux_mode: 'popup',
        callback: (response) => {
          if(response.access_token)
              access_token = response.access_token
        }
    })
}

function getTokens(code) {
    const data = {code : code}

    apiMixin.methods.postData(process.env.VUE_APP_CODE_URL, data, (response) => {
        if(response) {
            access_token = response.tokens.access_token
            window.localStorage.setItem('tokens', JSON.stringify(response))
            window.App.$store.commit("updateTokens", response)
            
           apiMixin.methods.getData(userInfo_url, (user) => {
                //this.loading = false  
                window.localStorage.setItem('user', JSON.stringify(user))
                window.location.replace(window.location.origin + window.location.pathname)
           })
        }
    })
}

function initCodeClient() {
    client = window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.VUE_APP_CLIENTID,
      scope: process.env.VUE_APP_SCOPE,
      ux_mode: 'popup',
      callback: (response) => {
        if(response.code) {
            getTokens(response.code) 
        }
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

function clearSession() {
    window.localStorage.setItem('user', null)
    window.localStorage.setItem('credential', null)
    window.App.$store.commit("updateCredential" , null)
    window.localStorage.setItem('tokens', null)
    window.App.$store.commit("updateTokens" , null)
    window.location.replace(window.location.origin + window.location.pathname)
}

function signOut() {
    const credential = window.App.$store.state.trafficlawstore.credential
    const tokensObj =  JSON.parse(window.localStorage.getItem('tokens'))
    if(credential) {
        window.google.accounts.id.revoke(credential.sub, (response) => {
            if(response)
                clearSession()
        })
    } else if(tokensObj) {
        window.google.accounts.oauth2.revoke(tokensObj.tokens.access_token, (response) => {
            if(response) 
                clearSession()
        })
    }
}

function handleCredentialResponse(response) {
    if(response) {
        window.localStorage.setItem('credential', response.credential)
        window.App.$store.commit("updateCredential" , response.credential)
        window.location.replace(window.location.origin  + window.location.pathname)
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
    toHHMMSS,
    getToken,
    loadClient,
    revokeToken,
    getAuthCode,
    authenticate,
    loadCalendar,
    clearSession,
    getVideosData,
    executeByFilter,
    apiDurationToDate
}