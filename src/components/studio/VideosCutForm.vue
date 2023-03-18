<template>
<FloatDialog
  title="Cut video" 
  :showDialog="dialog"
  :setShowDialog="setShowDialog"
>
  <template #form>
      <div>
  <v-progress-linear
    v-model="progress"
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
      @click="addCut"
    >
      Cut
  </v-btn>
  </template>
</FloatDialog>
</template>
<script>
  import apiMixin from "../../mixins/apiMixin"
  import {toHHMMSS} from "../../youtube/index"
  import FloatDialog from "./dialog/FloatDialog.vue"
  
  export default {
    name: 'VideosCutForm',
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
      },
      videos : {
        type : Array,
        default : () => {}
      },
      setChannelId : {
        type : Function,
        default : () => {}
      }
    },
    watch : {
      dialog : function() {
        if(this.dialog) {
          this.progress = 0
          //this.initTitle()
        }
      },
      '$store.state.trafficlawstore.playerReady' : {
        handler: function() {
          const {playerReady} = this.$store.state.trafficlawstore

          if(playerReady && playerReady.state) {
            this.initDuration()
           

            if(this.$yApi1 && this.$yApi1.videoTitle) {
              this.title =  this.$yApi1.videoTitle
              this.initForm()
            }
          }
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
      duration : 28,
      format : 'mp3',
      progress: 0,
      publishedAt : '',
      channelTitle : '',
      formats : ['mp3', 'mp4']
    }},
    mixins : [
      apiMixin
    ],
    mounted() {
      this.progress = 0
    },
    methods : {
      toHHMMSS,
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
        let currentVideo = this.videos.find(video => video.title === this.title)

        if(currentVideo) {
          this.publishedAt = this.strToLocaleDate(currentVideo.publishedAt)
          this.channelTitle = currentVideo.channelTitle
          this.setChannelId(currentVideo.channelId)
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
            cut.startSeconds === item.startSeconds &&  cut.endSeconds ===  item.endSeconds
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
          }
        }
      },
      getProgress : function() {
        const videoId = this.getVideoId()
        const url = process.env.VUE_APP_API_URL + "/google/youtube/download/progress"

        if(videoId) {
          this.getData(url + "?videoId=" + videoId + '&format=' + this.format, (response) => {
              if(response) {
                this.progress = Number(response.download) 
                if(this.progress !== 100) {
                  setTimeout(() => {
                    this.getProgress()
                  }, 2000)
                }
              }
            })
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
      download : function() {
        const yUrl = this.$yApi1.getVideoUrl()
        const videoId = this.getVideoId()

        const parameters = {
          start : this.start,
          end : this.end,
          yUrl : yUrl,
          format : this.format,
          videoId : videoId,
          title : this.title
        }
        
        const url = process.env.VUE_APP_API_URL + "/google/youtube/download"

        if(url && videoId) {
          this.getStream(url, parameters, () => {
            this.progress = 100
          })

          this.getProgress()
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
