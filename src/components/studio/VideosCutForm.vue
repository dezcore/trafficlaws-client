<template>
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
      <v-col cols="8" class="pa-2">
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
      <v-col cols="12">
        <v-btn
            color="primary"
            text
            @click="play"
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
            Add cut
          </v-btn>
      </v-col>
    </v-row>
  </v-form>
</v-card-text>
</div>
</template>
<script>
  import apiMixin from "../../mixins/apiMixin"
  import {toHHMMSS} from "../../youtube/index"
  export default {
    name: 'VideosCutForm',
    props : {
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      setCounter : {
        type : Function,
        default : ()=>{}
      }
    },
    watch : {
      dialog : function() {
        if(this.dialog) {
          this.progress = 0
        }
      },
      '$store.state.trafficlawstore.playerReady' : {
        handler: function() {
          const {playerReady} = this.$store.state.trafficlawstore
          if(playerReady && playerReady.state) {
            this.initDuration()
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
      duration : 28,
      format : 'mp3',
      progress: 0,
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
      getVideoId : function() {
        let res = null
        const url_parse = new URL(this.$yApi1.getVideoUrl());

        if(url_parse)
          res = url_parse.searchParams.get('v')

        return res
      },
      addCut : function() {
        const videoId = this.getVideoId()
        const {videoTitle} = this.$store.state.trafficlawstore

        if(videoId) {
          this.cuts.unshift({
            'videoId': videoId,
            'title' : videoTitle,
            'startSeconds': this.start,
            'endSeconds': this.end,
            'format' : this.format,
            'duration' : this.toHHMMSS(Number(this.end) - Number(this.start)),
            src: "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg"
          })
          this.setCounter()
          this.$store.commit("updateCuts", this.cuts)
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
        this.duration = this.$yApi1.getDuration()
        this.start = 0
        this.end = this.duration
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
          videoId : videoId
        }
        const url = process.env.VUE_APP_API_URL + "/google/youtube/download"

        if(url && videoId) {
          this.getStream(url, parameters, () => {
            this.progress = 100
          })

          this.getProgress()
        }
      },
      play : function() {
        const videoId = this.getVideoId()

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
