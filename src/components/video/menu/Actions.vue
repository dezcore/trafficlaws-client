<template>
<v-card>
  <div v-if="title">
     <v-row class="fill-width">
      <v-col cols="6">
         <strong>Questions</strong> 
      </v-col>
      <v-col cols="6">
        <strong>Réponses</strong>
      </v-col>
    </v-row>
  </div>
  <div v-else>

    <v-bottom-navigation
      :value="value"
      color="primary"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn  v-bind="attrs" v-on="on" icon color="green" @click="setShowResponse">
            <v-icon aria-hidden="false" v-if="showResponse">
              mdi-eye-outline
            </v-icon>
            <v-icon aria-hidden="false" v-else>
              mdi-eye-off-outline
            </v-icon>
          </v-btn>
        </template>
         <span>{{message}}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon color="green" @click="resetResponses">
            <v-icon aria-hidden="false">
              mdi-restore
            </v-icon>
          </v-btn>
        </template>
        <span>Restore responses</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn  v-bind="attrs" v-on="on" icon color="green" @click="flushResponse">
            <v-icon aria-hidden="false">
              mdi-cloud-upload-outline
            </v-icon>
          </v-btn>
        </template>
         <span>Upload responses</span>
      </v-tooltip>
      <DeleteDialog
          :videoId="videoId" 
          :removeFile="removeFile"
        >
          <template #dialogButton="{deletedialog, attrs}">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn v-bind="attrs" v-on="{...deletedialog, ...tooltip}" icon color="green">
                  <v-icon aria-hidden="false">
                    mdi-file-document-remove-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Remove file</span>
            </v-tooltip>
          </template>
        </DeleteDialog>
    </v-bottom-navigation>
  </div>
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
  import apiMixin from "../../../mixins/apiMixin"
  import fileMixin from '../../../mixins/fileMixin'
  import DeleteDialog from "../../dialog/DeleteDialog.vue"
  import responseMixin from "../../response/mixin/responseMixin"

  export default {
    name: 'Actions',
    components : {
      DeleteDialog
    },
    props : {
      responses : {
        type : Array,
        default : ()=>{return []}
      },
      videoId : {
        type :  String,
        default : ()=>{return null}
      },
      title : {
        type : Boolean,
        default : ()=>{return true}
      },
      enableEditMode : {
        type : Function,
        default : ()=>{}
      },
      resetResponses : {
        type : Function,
        default : () => {}
      }
    },
    data: () => ({
      value: 1,
      progress : false,
      showResponse : false,
      currentConfig : null,
      message : 'Show responses'
    }),
    mixins : [
      apiMixin,
      fileMixin,
      responseMixin
    ],
    watch : {
      '$store.state.trafficlawstore.config' : {
        handler: function() {
          const {config} = this.$store.state.trafficlawstore

          if(config) {
            this.currentConfig = config
          }
        },
        immediate : true
      },
    },
    methods : {
      setShowResponse : function() {
        this.showResponse = !this.showResponse
        this.enableEditMode()
        this.message = this.showResponse ?  "Hide reponses" : "Show responses"
        this.$store.commit("updateShowResponse", this.showResponse)
      },
      flushResponse : function() {
        const fileName = this.videoId + ".json"
        const {tokens, userResponses, defaultResponses} = this.$store.state.trafficlawstore
        
        if(tokens && this.currentConfig) {
          this.viewToModel(userResponses, defaultResponses, ({v1, v2}) => {
            this.responsesToData(v1, v2, this.videoId, (data) => {
              this.progress = true
              this.postFile(this.currentConfig.appFolder, fileName, data, () => {
                this.$store.commit("updateVResponse", data)
                this.progress = false
              })
            }) 
          })
        }
      },
      removeFile : function(videoId) {
        const fileName = this.videoId + ".json"
        const {tokens, vResponse} = this.$store.state.trafficlawstore

        if(tokens && videoId) {
          this.progress = true
          this.deleteFileByName(fileName, (res) => {
            if(res) {
              vResponse.defaultResponses = []
              this.$store.commit("updateUserResponses", [])
              this.$store.commit("updateVResponse", vResponse)
              this.$store.commit("updateDefaultResponses",[])
              this.progress = false
            }
          })
        }
      }, 
    }
  }
</script>

<style scoped>
</style>