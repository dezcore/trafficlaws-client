<template>
<v-card>
  <v-bottom-navigation
      :value="value"
      color="primary"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon color="green" @click="nextVideos">
            <v-icon aria-hidden="false">
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
         <span>More</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn  v-bind="attrs" v-on="on" icon color="green" @click="flushPlayList">
            <v-icon aria-hidden="false">
              mdi-cloud-upload-outline
            </v-icon>
          </v-btn>
        </template>
         <span>Upload videos</span>
      </v-tooltip>
      <DeleteDialog 
        :removFolder="removFolder"
      >
         <template #dialogButton="{deletedialog, attrs}">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn v-bind="attrs" v-on="{...deletedialog, ...tooltip}" icon color="green">
                  <v-icon aria-hidden="false">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <span>Delete folder</span>
            </v-tooltip>
         </template>
      </DeleteDialog>
    </v-bottom-navigation>
  <v-progress-linear
    v-if="progress"
    color="deep-purple accent-4"
    indeterminate
    rounded
    height="6"
  ></v-progress-linear>
</v-card>

</template>
<script>
  import apiMixin from "../mixins/apiMixin"
  import DeleteDialog from "./DeleteDialog.vue"
  
  export default {
    name: 'VideosActions',
    components : {
       DeleteDialog
    },
    props : {
      channels : {
        type : Array,
        default : () => {return []}
      },
      videos : {
        type : Array,
        default : () => {return []}
      },
      nextVideos : {
        type : Function,
        default : ()=>{}
      },
      playerVideoId : {
        type : String
      },
      nextPageToken : {
        type : String,
        default : ()=>{return ""}
      },
      channelNextPageToken : {
        type : String,
        default : ()=>{return ""}
      },
    },
    data: () => ({
      value: 1,
      progress : false,
      currentArchives : [] 
    }),
    mixins : [
      apiMixin
    ],
    methods : {
      removFolder : function() {
        const {tokens} = this.$store.state.trafficlawstore

        if(tokens) {
          this.deleteData(process.env.VUE_APP_API_URL + "/folder/" + process.env.VUE_APP_DRIVE_FOLDER, (res) => {
            if(res)
              this.getVideoResponses()
          })
        }
      },
      flushPlayList : function() {
        const {tokens} = this.$store.state.trafficlawstore

        if(tokens && this.channels && this.videos) {
          this.progress = true

          this.postData(process.env.VUE_APP_API_URL, {
            folderName :  process.env.VUE_APP_DRIVE_FOLDER,
            fileName : "videos.json",
            data : {
              videos : this.videos,
              channels : this.channels,
              nextPageToken : this.nextPageToken,
              playerVideoId : this.playerVideoId,
              channelNextPageToken : this.channelNextPageToken 
            }
          }
          , (data) => {
            if(data)
              this.progress = false
          }) 
        }
      } 
    }
  }
</script>

<style scoped>
</style>