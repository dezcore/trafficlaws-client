import Vue from 'vue'

let cpt = 0
const yApi = Vue.observable({ state : {} })

Object.defineProperty(Vue.prototype, '$yApi', {
    get () {
      return yApi.state
    },
    set (value) {
      yApi.state = value
    }
})

Object.defineProperty(Vue.prototype, '$yApi1', {
  get () {
    return yApi.state
  },
  set (value) {
    yApi.state = value
  }
})

Object.defineProperty(Vue.prototype, '$yApi2', {
  get () {
    return yApi.state
  },
  set (value) {
    yApi.state = value
  }
})

function loadVideo(id, pHeight, pWidth, vId) {
    const playerId = id ? id :"player"
    const height = pHeight ? pHeight : "455"
    const width = pWidth ? pWidth : "700"
    const videoId = vId ? vId : "M7lc1UVf-VE"
    
    window.YT.ready(function() {
      new window.YT.Player(playerId, {
        height: height,
        width: width,
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      })
    })

    function onPlayerReady(event) {
      cpt++
      Vue.set(Vue.prototype, '$yApi' + cpt, event.target)
      window.App.$store.commit("updatePlayerReady", {state : true})

      //
      /*player.loadVideoByUrl({mediaContentUrl:String,
        startSeconds:Number,
        endSeconds:Number,
        suggestedQuality:String})*/
      //event.target.playVideo()
    }

    function onPlayerStateChange(event) {
      //let videoStatuses = Object.entries(window.YT.PlayerState)
      
      if(event && yApi.state) {
        switch(event.data){
          // Stop the video on ending so recommended videos don't pop up
          case 0:     // ended
            yApi.state.stopVideo();
            break;
          case -1:    // unstarted
          case 1:     // playing
          case 2:     // paused
          case 3:     // buffering
            window.App.$store.commit("updatePlayerReady", {state : true});
            break;
          case 5:     // video cued
          default:
        }
      }
    }
}

export {
    loadVideo
}