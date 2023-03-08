<template>
<div>
  <v-card-text>
  <v-form
    ref="form"
    lazy-validation
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="item.title"
          label="Title"
        ></v-text-field>
      </v-col>
      <v-col cols="8" class="pa-2">
        <v-slider
          v-model="item.startSeconds"
          :min="0"
          step="0.5"
          :max="getDuration"
          label="Start"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model.number="item.startSeconds"
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
          v-model="item.endSeconds"
          :min="0"
          step="0.5"
          :max="getDuration"
          label="End"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model.number="item.endSeconds"
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
        v-model="item.format"
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
            @click="save(item)"
          >
            Save

          </v-btn>
      </v-col>
    </v-row>
  </v-form>
</v-card-text>
</div>
</template>
<script>
  import apiMixin from "../../mixins/apiMixin"
  
  export default {
    name: 'EditCutForm',
    props : {
      editedItem : {
        type : Object,
        default : () => {return null}
      },
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      save : {
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
      editedItem : {
        handler: function() {
          if(this.dialog && this.editedItem) {
            this.item = this.editedItem
          }
        },
        immediate : true
      }
    },
    computed : {
      getDuration : function() {
        return this.$yApi1.getDuration()
      }
    },
    data () {return {
      cuts : [],
      item : {
        start : 0,
        end : 64,
        format : 'mp3',
      },
      formats : ['mp3', 'mp4']
    }},
    mixins : [
      apiMixin
    ],
    mounted() {
      this.progress = 0
    },
    methods : {
      getVideoId : function() {
        let res = null
        const url_parse = new URL(this.$yApi1.getVideoUrl());

        if(url_parse)
          res = url_parse.searchParams.get('v')

        return res
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
