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
  import responseMixin from "../../response/mixin/responseMixin"

  export default {
    name: 'Actions',
    components : {
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
      message : 'Show responses'
    }),
    mixins : [
      apiMixin,
      responseMixin
    ],
    watch : {},
    methods : {
      setShowResponse : function() {
        this.showResponse = !this.showResponse
        this.enableEditMode()
        this.message = this.showResponse ?  "Hide reponses" : "Show responses"
        this.$store.commit("updateShowResponse", this.showResponse)
      },
      flushResponse : function() {
        const {tokens, userResponses, defaultResponses} = this.$store.state.trafficlawstore

        if(tokens) {
          this.viewToModel(userResponses, defaultResponses, ({v1, v2}) => {
            this.responsesToData(v1, v2, this.videoId, (res) => {
             this.progress = true
              this.postData(process.env.VUE_APP_API_URL, res, () => {
                this.$store.commit("updateVResponse", res.data)
                this.progress = false
              })
            }) 
          })
        }
      } 
    }
  }
</script>

<style scoped>
</style>