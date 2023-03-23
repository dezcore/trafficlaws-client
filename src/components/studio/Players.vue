<template>
  <v-row>
    <v-col cols="6" v-if="view === 'videosView'">
      <VideosView
        :getFile="getFile"
        :postFile="postFile" 
        :playList="playList"
        :changeVideo="changeVideo"
      />
    </v-col>

    <v-col cols="6" v-if="view === 'cutsView'">
      <CutsView
        :cutsSelections="cuts"
        :playCut="playCut"
      />
    </v-col>
    <v-col cols="6" v-if="view === 'channelsView'">
      <Channels 
        :setView="setView"
        :channels="channels"
        :getFile="getFile"
        :postFile="postFile"
      />
    </v-col>
    <v-col cols="6">
      <v-row justify="start">
        <v-col cols="12">
          <div class="box" ref="box">
            <div id="player"></div>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>

  import $ from "jquery"
  import {loadVideo} from "./../../youtube/iframe"
  import VideosView from "./../studio/VideosView.vue"
  import CutsView from "./../studio/CutsView.vue"
  import Channels from "./../studio/Channels.vue"
  import apiMixin from "../../mixins/apiMixin"
  import fileMixin from "../../mixins/fileMixin"

  export default {
    name: 'Players',
    props : {
      setView : {
        type : Function,
        default : () => {}
      },
      playList : {
        type : Array,
        default : ()=>{return []}
      },
      channels : {
        type : Array,
        default : ()=>{return []}
      },
      view : {
        type : String,
        default : ()=>{return true}
      }
    },
    watch : {
      '$store.state.trafficlawstore.cuts' : {
        handler: function() {
          const {cuts} = this.$store.state.trafficlawstore
          if(cuts) {
            this.cuts = cuts
          }
        },
        immediate : true
      }
    },
    data() {
      return {
        cuts : [],
        playerVideoId : "11-lpoJHu0U"
      }
    },
    mixins : [
      apiMixin,
      fileMixin
    ],
    components : {
      CutsView,
      VideosView,
      Channels
    },
    mounted() {
      this.boundPlayer()
    },
    unmounted() {
      window.removeEventListener("resize", this.onResize)
    },
    methods : {
      boundPlayer : function() {
        let playerWidth
        const clientWidth = this.$refs.box.clientWidth
        
        if(clientWidth) {
          playerWidth = Math.floor(Number(this.$refs.box.clientWidth) * 0.99)//99% of box
          this.initPlayer(playerWidth)
          window.addEventListener("resize", this.onResize)
        }
      },
      onResize : function () {
        const playerWidth = Math.floor(Number(this.$refs.box.clientWidth) * 0.99)//99% of box
        $("#player").width(playerWidth)
      },
      initPlayer : function(width) {
        $(document).ready(function() {
          $.getScript("https://www.youtube.com/iframe_api", function() {
            loadVideo(null, null, width, this. playerVideoId)
          })
        })
      },
      changeVideo : function(playerVideoId) {
        const {loadVideoById} = this.$yApi1
        if(playerVideoId && loadVideoById) {
          this.playerVideoId = playerVideoId
          this.$yApi1.loadVideoById({'videoId': playerVideoId})
        }
      },
      playCut : function(videoId, startSeconds, endSeconds) {
        if(videoId) {
          this.$yApi1.loadVideoById({
            'videoId': videoId,
            'startSeconds': startSeconds,
            'endSeconds': endSeconds
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>