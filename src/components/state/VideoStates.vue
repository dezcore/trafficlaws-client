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
        :point="point" 
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
                  :removeElement="removeElement"
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
  import apiMixin from "../../mixins/apiMixin"
  import Chart from "../chart/Chart.vue"
  import DeleteDialog from "../dialog/DeleteDialog.vue"
  import VideoMenu from "./menu/VideoMenu.vue"
  import responseMixin from "../response/mixin/responseMixin"

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
      }
    },
    components : {
      Chart,
      VideoMenu,
      DeleteDialog
    },
    watch : {
      '$store.state.trafficlawstore.vResponse' : {
        handler: function() {
          const {vResponse} = this.$store.state.trafficlawstore

          if(vResponse) {
            if(vResponse.defaultResponses && vResponse.defaultResponses.length === 0) {
              this.states = []
            } else {
              this.parameters = []
              this.responsesToParameter(vResponse, (parameter) => {
                this.parameters.push(parameter)
                this.setTableStates(parameter)
              })
            }
            
          }

        },
        immediate : true
      },
      '$store.state.trafficlawstore.userResponses' : {
        handler: function() {
          this.refreshOverView()
        },
        immediate : true
      },
      '$store.state.trafficlawstore.defaultResponses' : {
        handler: function() {
          this.refreshOverView()
        },
        immediate : true
      },
    },
    mixins : [
      apiMixin,
      responseMixin
    ],
    data: () => ({
      states : [],
      point : null,
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
      refreshOverView : function() {
        const {userResponses, defaultResponses} = this.$store.state.trafficlawstore

        if(userResponses && defaultResponses) {

          this.viewToModel(userResponses, defaultResponses, (v1, v2) => {
            this.evaluateResponses(v1, v2, (res) => {
              this.statesOverView.corrects.value = Number(res)
              this.statesOverView.errors.value = this.nbrQuestions - Number(res)
            })
          })
        } else {
          this.statesOverView.errors.value = this.nbrQuestions 
        }
      },
      setTableStates : function(parameter) {
        this.states = []

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
      removeElement : function(element) {
        let index
        const {vResponse} = this.$store.state.trafficlawstore
        const {videoId} = vResponse

        if(element && vResponse) {
          vResponse.userResponses = vResponse.userResponses.filter(
            uResponses => uResponses[element.date] === undefined
          )
          
          this.point = element
          index = this.states.indexOf(element)
          this.states.splice(index, 1)

          this.$store.commit("updateVResponse", vResponse)
          this.viewToModel(vResponse.userResponses, vResponse.defaultResponses, ({v2}) => {
            this.responsesToData(null, v2, videoId, (res) => {
              this.postData(process.env.VUE_APP_API_URL, res)
            })
          })
        }
      },
      removeFolder : function() {
        const {tokens} = this.$store.state.trafficlawstore
        if(tokens) {
          this.deleteData(process.env.VUE_APP_API_URL + "/folder/" + process.env.VUE_APP_DRIVE_FOLDER, (res) => {
            if(res)
              this.getVideoResponses(this.videoId)
          })
        }
      },
    }
  }
</script>
