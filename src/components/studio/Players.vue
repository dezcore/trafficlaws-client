<template>
  <v-row>
    <v-col cols="6" v-if="videosView">
      <VideosView 
        :playList="playList"
        :changeVideo="changeVideo"
      />
    </v-col>
    <v-col cols="6" v-else>
      <CutsView
        :cuts="cuts"
        :playCut="playCut"
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
   <v-col cols="12">
      <VideosCut/>
    </v-col>
  </v-row>
</template>
<script>

  import $ from "jquery"
  import {loadVideo} from "./../../youtube/iframe"
  import VideosCut from "./../studio/VideosCut.vue"
  import VideosView from "./../studio/VideosView.vue"
  import CutsView from "./../studio/CutsView.vue"

  export default {
    name: 'Players',
    props : {
      playList : {
        type : Array,
        default : ()=>{return []}
      },
      videosView : {
        type : Boolean,
        default : ()=>{return true}
      }
    },
    watch : {
      playList : function() {
        console.log("watch playList : ",)
      },
      '$store.state.trafficlawstore.cuts' : {
        handler: function() {
          const {cuts} = this.$store.state.trafficlawstore
          if(cuts)
            this.cuts = cuts
        },
        immediate : true
      }
    },
    data () {
      return {
        cuts : [],
        playerVideoId : "11-lpoJHu0U"
      }
    },
    components : {
      VideosCut,
      CutsView,
      VideosView
    },
    mounted() {
      //const clientHeight = this.$refs.box.clientHeight
      const clientWidth = Math.floor(Number(this.$refs.box.clientWidth) * 0.99)//99% of box
      this.initPlayer(clientWidth)
    },
    methods : {
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
