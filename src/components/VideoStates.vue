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
          this.responsesToParameter((parameter) => {
            if(parameter) {
              this.parameters.push(parameter)
              this.refreshScore(parameter)
            }
          })
        },
        immediate : true
      },
      '$store.state.trafficlawstore.responses' : {
        handler: function() {
          //const {responses} = this.$store.state.trafficlawstore
          //if(responses)
          //  this.setCurrentScore(responses)
        },
        immediate : true
      }
    },
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
        console.log("param : ", parameter)
        if(parameter.x) {
          parameter.x.forEach((date, index) => {
            this.states.push({
              date : date,
              videoId : parameter.name,
              score : parameter.y[index] + "/40",
              save : true
            })
          })
        }
      },
      evalUserRes : function(responses, date, userRes, callBack) { 
        if(responses && date && userRes && callBack){
          callBack(responses.defaultResponses.map((resArray, index) => {
            return resArray.map((val) => {
              return !userRes[date][index].some(e => e === val) ? 0 : 1
            })
          }).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0))
        } else {
          return callBack(0)
        }
      },
      responsesToParameter : function(callBack) {
        let dates = [], values = []
        const responses = this.videosResponses[this.playerVideoId]

        if(responses) {
          responses.userResponses.forEach((response) => {
            Object.keys(response).forEach((date) => {
              this.evalUserRes(responses, date, response, (value) => {
                dates.push(date)
                values.push(value)
              })
            })
          })

          if(callBack)
            callBack({name : this.playerVideoId, x : dates, y : values, color : 'rgba(245, 40, 145, 0.8)'})
        }

        
      },
    }
  }
</script>
