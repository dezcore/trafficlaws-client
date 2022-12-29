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
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in states"
          :key="item.date"
        >
          <td class="text-left">{{ item.date }}</td>
          <td class="text-left">{{ item.videoId }}</td>
          <td class="text-left">{{ item.score }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
  </div>
</template>

<script>
  import Chart from "../components/chart/Chart.vue"
  import responseMixin from "../components/response/mixin/responseMixin"

  export default {
    name: 'VideoStates',
    props : {
      nbrQuestions : {
        type : Number,
        default : () => { return 0}
      },
      videosResponses : {
        type : Object,
        default : ()=>{return {}}
      },
      playerVideoId : {
        type : String,
        default : ()=>{ return ""}
      }
    },
    components : {
      Chart,
    },
    watch : {
      videosResponses : {
        handler: function() {
          const responses = this.videosResponses[this.playerVideoId]

          if(responses.userResponses && responses.defaultResponses) {
            this.responsesToParameter(responses, (parameter) => {
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
      }
    }
  }
</script>
