import Vue from 'vue'

const yApi = Vue.observable({ state : {} })

Object.defineProperty(Vue.prototype, '$yApi', {
    get () {
      return yApi.state
    },
    set (value) {
      yApi.state = value
    }
})

function loadVideo() {
    window.YT.ready(function() {
      new window.YT.Player("player", {
        height: "455",
        width: "700",
        videoId: "M7lc1UVf-VE",
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      })
    })

    function onPlayerReady(event) {
      Vue.set(Vue.prototype, '$yApi', event.target)
      //console.log("event : ", event.target)
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
          case 5:     // video cued
          default:
        }
      }
    }
}

export {
    loadVideo
}