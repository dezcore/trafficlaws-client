<template>
  <div>
    <v-row class="mb-2">
      <v-col cols="6" 
        v-for="item in statesOverView" 
        :key="item.title"
      >
        <v-card height="100" :color="item.color">
          <v-card-title>
            {{item.title}} {{item.value}}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-card>
      <Chart 
        :parameters="parameters"
      />
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Date
              </th>
              <th class="text-left">
                VideoId
              </th>
              <th class="text-left">
                Score
              </th>
              <th class="text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in states"
              :key="item.date"
            >
              <td class="text-left">{{ item.date }}</td>

              <td class="text-left mt-1">
                <VideoMenu :videoId="item.videoId">
                  <template #VideoMenu="{vOn, attrs}">
                    <span v-bind="attrs" v-on="vOn">{{ item.videoId }}</span>
                  </template>
                </VideoMenu>
              </td>
              <td class="text-left">{{ item.score }}</td>
              <td class="text-left">
                <DeleteDialog 
                  :item="item"
                  :removFolder="deleteFile"
                >
                  <template #dialogButton="{deletedialog, attrs}">
                    <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn v-bind="attrs" v-on="{...deletedialog, ...tooltip}" icon color="green">
                        <v-icon aria-hidden="false" small>
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </template>
                      <span>Delete folder</span>
                    </v-tooltip>
                  </template>
                </DeleteDialog>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
  import apiMixin from "../mixins/apiMixin"
  import Chart from "../components/chart/Chart.vue"
  import DeleteDialog from "../components/DeleteDialog.vue"
  import VideoMenu from "../components/state/menu/VideoMenu.vue"
  import responseMixin from "../components/response/mixin/responseMixin"

  export default {
    name: 'VideoStates',
    props : {
      nbrQuestions : {
        type : Number,
        default : () => { return 0}
      },
      playerVideoId : {
        type : String,
        default : ()=>{ return ""}
      },
      vStates : {
        type : Object,
        default : ()=>{return null}
      }
    },
    components : {
      Chart,
      VideoMenu,
      DeleteDialog
    },
    watch : {
      vStates : {
        handler: function() {
          if(this.vStates) {
            this.responsesToParameter(this.vStates, (parameter) => {
              if(parameter) {
                this.parameters.push(parameter)
                this.refreshScore(parameter)
              }
            })
          }
        },
        immediate : true
      },
      '$store.state.trafficlawstore.responses' : {
        handler: function() {
          const {responses} = this.$store.state.trafficlawstore

          if(responses && responses.userResponses && responses.defaultResponses) {
            this.resDbFormat(responses, ({userResponses, defaultResponses}) => {
              this.evalUserRes(defaultResponses, null, userResponses, (res) => {
                this.statesOverView.corrects.value = Number(res)
                this.statesOverView.errors.value = this. nbrQuestions - Number(res)
              })
            })
          }
        },
        immediate : true
      }
    },
    mixins : [
      apiMixin,
      responseMixin
    ],
    data: () => ({
      states : [],
      statesOverView : {
        corrects : {
          color : 'green',
          title : 'Corrects',
          value : '0'
        },
        errors : {
          color : 'red',
          title : 'Errors',
          value : '0'
        }
      },
      parameters : []
    }),
    methods : {
      refreshScore : function(parameter) {
        if(parameter.x) {
          parameter.x.forEach((date, index) => {
            this.states.push({
              date : date,
              videoId : parameter.name,
              score : parameter.y[index] + "/" + this.nbrQuestions,
              save : true
            })
          })
        }
      },
      removFolder : function() {
        const {tokens} = this.$store.state.trafficlawstore

        if(tokens) {
          this.deleteData(process.env.VUE_APP_API_URL + "/folder/" + process.env.VUE_APP_DRIVE_FOLDER, (res) => {
            if(res)
              this.getVideoResponses(this.videoId)
          })
        }
      },
      deleteFile : function(item) {
        let index, elements
        if(item) {
          this.deleteData(process.env.VUE_APP_API_URL + "/folder/" + item.videoId + ".json", (res) => {
            elements = this.states.filter(state => state.videoId === item.videoId)
            
            if(elements) {
              elements.forEach((element) => {
                index = this.states.indexOf(element)
                this.states.splice(index, 1)
              })
            }

            if(res)
              this.getVideoResponses(this.videoId)

          })
        }
      }
    }
  }
</script>
