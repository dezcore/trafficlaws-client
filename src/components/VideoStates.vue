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
  export default {
    name: 'VideoStates',
    props : {
      nbrQuestions : {
        type : Number,
        default : () => { return 0}
      }
    },
    data: () => ({
      states : [
        {
          date : '05-09-2022 12:30',
          videoId : 'videoId',
          score : '20/40',
          save : true
        }
      ],
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
      }
    }),
    watch : {
      '$store.state.trafficlawstore.responses' : {
        handler: function() {
          const {responses} = this.$store.state.trafficlawstore
          if(responses)
            this.setCurrentScore(responses)
        },
        immediate : true
      }
    },
    methods : {
      initCurrentState : function(videoId, currentScore) {
        let targetState

        if(videoId && currentScore) {
          targetState = this.states.find(state => !state.save)

          if(targetState) {
            targetState.date = new Date().toISOString()
            targetState.score = currentScore
          } else {
            this.states.push({
              date : new Date().toISOString(),
              videoId : videoId,
              score : currentScore,
              save : false
            })
          }
        }
      },
      setCurrentScore : function(responses) {
        let correctResponse = 0, errors = 0
        let defaultResponse, userResponse, currentResponses
        const {userResponses, defaultResponses, videoId} = responses
        let currentScore = correctResponse + "/" + this.nbrQuestions 

        if(userResponses && defaultResponses && videoId) {
          currentResponses = Object.keys(userResponses)
          currentResponses.forEach((resIndex) => {
            defaultResponse = defaultResponses[resIndex]
            userResponse = userResponses[resIndex]

            if(!userResponse.some(value => !defaultResponse.some(res => value === res.label && res.color === 'green')))
              correctResponse++
            else
              errors++
          })

          if(currentResponses)
            currentScore = correctResponse + "/" + (currentResponses.length === 0 ?this.nbrQuestions   : currentResponses.length)
          
          this.initCurrentState(videoId, currentScore)
          this.statesOverView.corrects.value = correctResponse
          this.statesOverView.errors.value = errors
        }
      }
    }
  }
</script>
