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
          <v-btn v-bind="attrs" v-on="on" icon color="green" @click="enableEditMode">
            <v-icon aria-hidden="false">
              mdi-clipboard-edit-outline
            </v-icon>
          </v-btn>
        </template>
         <span>Edit responses</span>
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
  import apiMixin from "../mixins/apiMixin"

  export default {
    name: 'Actions',
    components : {
    },
    props : {
      responses : {
        type : Array,
        default : ()=>{return []}
      },
      userArchives : {
        type : Array
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
      },
      getVideoResponses : {
        type : Function,
        default : () => {}
      }
    },
    data: () => ({
      value: 1,
      progress : false,
      currentArchives : [],
      showResponse : false,
      message : 'Hide responses'
    }),
    mixins : [
      apiMixin
    ],
    watch : {
      userArchives :  {
        handler: function() {
          if(this.userArchives) {
            this.currentArchives = [...this.currentArchives, ...this.userArchives]    
          }
        },
        immediate : true
      }
    },
    methods : {
      setShowResponse : function() {
        this.showResponse = !this.showResponse
        this.message = this.showResponse ? "Show responses" : "Hide reponses"
        this.$store.commit("updateShowResponse", this.showResponse)
      },
      getDefaultResponses : function() {
        let responses = []

        if(this.responses) {
          responses = this.responses.map((res) => {
              return res.map((res2) => {
                return res2.color === 'red' ? '' : res2.label
              }).filter(element => element !== '')
            })
        }

        return responses
      },
      getUserResponses : function() {
        let res = {}
        const {responses} = this.$store.state.trafficlawstore

        if(responses && responses.userResponses) {
          res[new Date().toISOString()] = Array.from({length: 40}, (v, k) => {
            const keys = Object.keys(responses.userResponses)
            return  keys.some(e => Number(e) === k) ? responses.userResponses[k] : []
          })
        }

        return res
      },
      flushResponse : function() {
        const {tokens} = this.$store.state.trafficlawstore

        if(tokens && this.videoId) {
          this.currentArchives = [...this.currentArchives, this.getUserResponses()]

          this.progress = true

          this.postData(process.env.VUE_APP_API_URL, {
            folderName :  process.env.VUE_APP_DRIVE_FOLDER,
            fileName : this.videoId + ".json",
            data : {
              videoId : this.videoId,
              userResponses : this.currentArchives,
              defaultResponses : this.getDefaultResponses()
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