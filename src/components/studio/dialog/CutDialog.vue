<template>
<FloatDialog
  title="Cuts" 
  :showDialog="dialog"
  :setShowDialog="setShowDialog"
>
  <template #form>
      <div>
  <v-progress-linear
    v-if="showProgress"
    :value="progress"
    height="28"
  >
    <strong>{{progress}}%</strong>
  </v-progress-linear>
  <v-card-text>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row>
       <v-col cols="6">
        <v-text-field
          disabled
          v-model="channelTitle"
          label="Channel title : "
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          disabled
          v-model="publishedAt"
          label="Published at : "
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="title"
          label="Title : "
        ></v-text-field>
      </v-col>
      <v-col cols="8" class="pa-2">
        <v-slider
          v-model="start"
          :min="0"
           step="0.5"
          :max="getDuration"
          label="Start"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model.number="start"
              class="mt-0 pt-0"
              type="number"
              step="0.5"
              :min="0"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-col>
      <v-col cols="4" class="pa-4">
        <v-btn
          color="success"
          class="mr-4"
          @click="defineStart"
        >
          Define start
        </v-btn>
      </v-col>
      <v-col cols="8">
        <v-slider
          v-model="end"
          :min="0"
          step="0.5"
          :max="getDuration"
          label="End"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model.number="end"
              class="mt-0 pt-0"
              type="number"
              step="0.5"
              :min="0"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-col>
      <v-col cols="4" class="pa-4">
        <v-btn
          color="success"
          class="mr-4"
          @click="defineEnd"
        >
          Define end
        </v-btn>
      </v-col>
      <v-select
        label="Format"
        v-model="format"
        :items="formats"
      ></v-select>
    </v-row>
  </v-form>
</v-card-text>
</div>
  </template>
  <template #buttons>
    <v-btn
      color="primary"
      text
      @click="play()"
    >
      Play
    </v-btn>
    <v-btn
      color="primary"
      text
      @click="download"
    >
      Download
    </v-btn>
    <v-btn
      color="primary"
      text
      @click="stop"
    >
      Stop
    </v-btn>
    <v-btn
      color="primary"
      text
      @click="addCut"
    >
      Cut
  </v-btn>
  </template>
</FloatDialog>
</template>
<script>
  import FloatDialog from "./FloatDialog.vue"
  import apiMixin from "../../../mixins/apiMixin"
  import fileMixin from "../../../mixins/fileMixin"
  import {toHHMMSS, parseYTitle} from "../../../youtube/index"

  export default {
    name: 'CutDialog',
    components : {
      FloatDialog
    },
    props : {
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      setShowDialog : {
        type : Function,
        default : ()=>{}
      },
      videoId : {
        type : String,
        default : () => {}
      }
    },
    watch : {
      dialog : function() {
        if(this.dialog) {
          this.progress = 0
          console.log("watch dialog : ", this.dialog)
        }
      },
      '$store.state.trafficlawstore.playerReady' : {
        handler: function() {
          const {playerReady} = this.$store.state.trafficlawstore
          console.log("dialog : ", this.dialog, ", playerReady.state : ", playerReady.state)
          if(playerReady && playerReady.state /*&& this.dialog*/) {
            this.initDuration()
           
            if(this.$yApi1 && this.$yApi1.videoTitle) {
              this.title =  this.$yApi1.videoTitle
              this.initForm()
            }
          }
        },
        immediate : true
      },
      '$store.state.studio.currentPlayList' : {
        handler: function() {
          const {currentPlayList} = this.$store.state.studio
          if(currentPlayList)
            this.videos = currentPlayList
        },
        immediate : true
      },
      videoId : {
        handler : function() {
          if(this.videoId) {
            this.play(this.videoId)
          }
        },
        immediate : true
      }
    },
    computed : {
      getDuration : function() {
        return this.duration
      }
    },
    data () {return {
      end : 64,
      cuts : [],
      start : 0,
      title : "",
      videos : [],
      duration : 28,
      format : 'mp3',
      progress: 28,
      publishedAt : '',
      channelTitle : '',
      showProgress : false,
      formats : ['mp3', 'mp4']
    }},
    mixins : [
      apiMixin,
      fileMixin
    ],
    mounted() {
      this.progress = 0
    },
    methods : {
      toHHMMSS,
      parseYTitle,
      strToLocaleDate : function(dateStr) {
        let date = dateStr

        if(date) {
          date = new Date(dateStr).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        }

        return date
      },
      initForm : function() {
        const videoId = this.getVideoId()
        let currentVideo = this.videos.find(video => video.id === videoId)

        if(currentVideo) {
          this.publishedAt = this.strToLocaleDate(currentVideo.publishedAt)
          this.channelTitle = currentVideo.channelTitle
        }
      },
      getVideoId : function() {
        let res = null
        const url_parse = new URL(this.$yApi1.getVideoUrl());

        if(url_parse)
          res = url_parse.searchParams.get('v')

        return res
      },
      existCut: function(item) {
        return (
          this.cuts.some(cut => 
            cut.videoId === item.videoId && cut.duration === item.duration &&
            cut.startSeconds === item.startSeconds &&  cut.endSeconds ===  item.endSeconds && cut.format === item.format
          )
        )
      },
      addCut: function() {
        let item
        const videoId = this.getVideoId()
        
        if(videoId) {
          item = {
            'videoId': videoId,
            'title' : this.title,
            'channelTitle': this.channelTitle,
            'publishedAt': this.publishedAt,
            'startSeconds': this.start,
            'endSeconds': this.end,
            'format' : this.format,
            'yUrl' : this.$yApi1.getVideoUrl(),
            'duration' : this.toHHMMSS(Number(this.end) - Number(this.start)),
            src: "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg"
          }
                    
          if(!this.existCut(item)) {
            this.cuts.unshift(item)
            this.$store.commit("updateCuts", this.cuts)
            this.$store.commit("updateCutsCpt", {value : this.cuts.length})
          }
        }
      },
      initDuration : function() {
        if(!this.dialog) {
          this.duration = this.$yApi1.getDuration()
          this.start = 0
          this.end = this.duration
        }
      },
      defineStart : function() {
        const videoId = this.getVideoId()
        if(videoId) {
          this.start = this.$yApi1.getCurrentTime()
        }
      },
      defineEnd : function() {
        const videoId = this.getVideoId()
        if(videoId) {
          this.end =  this.$yApi1.getCurrentTime()
        }
      },
      stop : function () {
        if(this.abortController) {
          this.showProgress = false
          this.abortController.abort()
        }
      },
      getProgress : function(videoId) {
        const progressUrl = process.env.VUE_APP_API_URL + "/google/youtube/download/progress"

        if(videoId) {
          this.getData(progressUrl + "?videoId=" + videoId + '&format=' + this.format, (response) => {
              if(response) {
                this.progress = Number(response.download) 
                if(this.progress !== 100) {
                  setTimeout(() => {
                    this.getProgress(progressUrl, videoId)
                  }, 2000)
                }
              }
            })
        }
      },
      download : function() {
        const videoId = this.getVideoId()
        const yUrl = this.$yApi1.getVideoUrl()

        if(videoId && yUrl) {
           this.showProgress = true
          this.abortController = new AbortController()
          this.downloadFile({
            start : this.start,
            end : this.end,
            yUrl : yUrl,
            format : this.format,
            videoId : videoId,
            title : this.title 
          }, this.abortController, () => {
            this.showProgress = false
            this.abortController = null
          })
          
          this.getProgress(videoId)
        }
      },
      play : function(id) {
        const videoId = typeof id === "string" ? id : this.getVideoId()

        if(videoId) {
          this.$yApi1.loadVideoById({
            'videoId': videoId,
            'startSeconds': this.start,
            'endSeconds': this.end
          })
        }

      },
    },
  }
</script>
