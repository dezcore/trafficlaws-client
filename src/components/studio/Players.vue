<template>
  <v-row>
    <v-col cols="6">
    <VideosView 
      :playList="playList"
      :changeVideo="changeVideo"
    />
  </v-col>
  <v-col cols="6">
    <v-row>
      <v-col cols="12">
          <div id="player"></div>
      </v-col>

      <v-col cols="12">
      <VideosCutForm 
        :playerVideoId="playerVideoId"
      />
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
  import VideosCutForm from "./../studio/VideosCutForm.vue"

  export default {
    name: 'Players',
    props : {
      playList : {
        type : Array,
        default : ()=>{return []}
      }
    },
    watch : {
      playList : function() {
        console.log("watch playList : ",)
      }
    },
    data () {
      return {
        playerVideoId : "11-lpoJHu0U"
      }
    },
    components : {
      VideosCut,
      VideosCutForm,
      VideosView
    },
    mounted() {
      this.initPlayer()
    },
    methods : {
       initPlayer : function() {
        $(document).ready(function() {
          $.getScript("https://www.youtube.com/iframe_api", function() {
            loadVideo()
          })
        })
      },
      changeVideo : function(playerVideoId) {
        const {loadVideoById} = this.$yApi1
        if(playerVideoId && loadVideoById) {
          this.playerVideoId = playerVideoId
          this.$yApi1.loadVideoById({'videoId': playerVideoId})
        }
      }
    }
  }
</script>
