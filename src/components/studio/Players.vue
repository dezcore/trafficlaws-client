<template>
  <v-row>
    <v-col cols="6" v-if="view === 'videosView'">
      <VideosView 
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
        :addFavoriteChannel="addFavoriteChannel"
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
    data () {
      return {
        cuts : [],
        favoriteChannels : [],
        playerVideoId : "11-lpoJHu0U"
      }
    },
    mixins : [
      apiMixin
    ],
    components : {
      CutsView,
      VideosView,
      Channels
    },
    mounted() {
      const playerWidth = Math.floor(Number(this.$refs.box.clientWidth) * 0.99)//99% of box
      this.initPlayer(playerWidth)
      window.addEventListener("resize", this.onResize)
    },
    unmounted() {
      window.removeEventListener("resize", this.onResize)
    },
    methods : {
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
      },
      addFavoriteChannel : function(channels) {
        if(channels) {
          this.favoriteChannels = [...this.favoriteChannels, ...channels]
        }
      },
      getFile : function(name, callBack) {
        if(name) {
          this.getData(process.env.VUE_APP_API_URL + "/google/drive/file/content/" + name, (response) => {
            if(callBack)
              callBack(response)
          })
        }
      },
      deleteFiles : function(index, files) {
        if(files && files[index] && (files[index].name === 'mp3' || files[index].name.includes('favorite'))) {
           this.deleteData(process.env.VUE_APP_API_URL + "/google/drive/file/" + files[index].fileId, () => {
             this.deleteFiles(index + 1 , files)
           })
        } else if(index < files.length) {
          this.deleteFiles(index + 1, files)
        }
      },
      getFiles : function() {
        this.getData(process.env.VUE_APP_API_URL + "/google/drive/files", (res) => {
            this.deleteFiles(0, res.files)
        })
      },
    }
  }
</script>

<style scoped>
</style>