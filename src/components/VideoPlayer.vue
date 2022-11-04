<template>
  <v-card :height="height">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <div id="player"></div>
      </v-col>
      <v-col cols="12"  class="d-flex justify-center pa-0">
        <v-card-title class="text-h6 text-center">
          {{getTilte}}
        </v-card-title>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import $ from "jquery"
  import {loadVideo} from "../youtube/iframe"

  export default {
    name: 'VideoPlayer',
    props : {
      height : {
        type : Number
      },
      playerVideoId : {
        type : String
      },
      videos : {
        type : Array,
        default : ()=>{return []}
      }
    },
    data: () => ({ 
      autoplay :  0,
      currentId : '',
      playerId : 'player'
    }),
    mounted() {
      this.initPlayer()
    },
    watch: {
      playerVideoId :  {
        handler :  function() {
          this.changeVideo()
        },
        immediate : true
      }
    },
    computed : {
      getVideoUrl : function() {
        const base = "https://www.youtube.com/embed/"
        const autoplay =  "autoplay=" + this.autoplay
        const playlist = "&playlist=" + this.videos.map(video => video.id.videoId)
        return this.playerVideoId === '' ? base + 'M7lc1UVf-VE' : base + this.playerVideoId + "?" +  autoplay + playlist
      },
      getTilte : function() {
        const video = this.videos.find(video => video.id.videoId === this.playerVideoId)
        return video ? video.snippet.title : ''
      }
    }, 
    methods : {
      initPlayer : function() {
        $(document).ready(function() {
          $.getScript("https://www.youtube.com/iframe_api", function() {
            loadVideo()
          })
        })
      },
      changeVideo : function() {
        const {loadVideoById} = this.$yApi
        if(loadVideoById && this.playerVideoId && this.playerVideoId  !== '') {
          this.$yApi.loadVideoById({'videoId': this.playerVideoId})
        }
      }
    }
  }
</script>