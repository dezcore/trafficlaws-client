<template>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row>
      <v-col cols="6" class="pa-2">
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
      <v-col cols="6" class="pa-2">
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
    </v-row>
    <v-btn
      color="success"
      class="mr-4"
      @click="playCut"
    >
      Play
    </v-btn>
    <v-btn
      color="success"
      class="mr-4"
      @click="defineStart"
    >
      Define start
    </v-btn>
    <v-btn
      color="success"
      class="mr-4"
      @click="defineEnd"
    >
      Define end
    </v-btn>
    <v-btn
      color="success"
      class="mr-4"
      @click="downloadCut"
    >
      Download
    </v-btn>
    <v-btn
      color="success"
      class="mr-4"
      @click="()=>{}"
    >
      Cut
    </v-btn>
  </v-form>
</template>
<script>

  import apiMixin from "../../mixins/apiMixin"

  export default {
    name: 'VideosCutForm',
    props : {
      playerVideoId : {
        type : String
      }
    },
    watch : {
      '$store.state.trafficlawstore.playerReady' : {
        handler: function() {
          const {playerReady} = this.$store.state.trafficlawstore
          
          if(playerReady && playerReady.state) {
            this.duration = this.$yApi1.getDuration()
            this.start = this.duration
            this.end = this.duration
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
      start : 128,
      blue: 0,
      duration : 28
    }},
    mixins : [
      apiMixin
    ],
    methods : {
      playCut : function() {
        if(this.start !== undefined && this.end !== undefined && this.playerVideoId) {
          this.$yApi1.loadVideoById({
            'videoId': this.playerVideoId,
            'startSeconds': this.start,
            'endSeconds': this.end
          })
        }
      },
      defineStart : function() {
        if(this.playerVideoId) {
          this.start =  this.$yApi1.getCurrentTime()
        }
      },
      defineEnd : function() {
        if(this.playerVideoId) {
          this.end =  this.$yApi1.getCurrentTime()
        }
      },
      downloadCut : function() {
        const url = this.$yApi1.getVideoUrl()
        if(url) {
          console.log("url : ", url)
          // + 
          //`${url}` + '&start=' + `${this.start}` + '&end=' + `${this.end}`
          this.getStream(process.env.VUE_APP_API_URL + "/google/youtube/download", this.start, this.end, url)
        }
      },
      saveCut : function() {

      }
    },
  }
</script>
