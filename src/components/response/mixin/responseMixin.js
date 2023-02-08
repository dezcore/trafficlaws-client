export default {
    data: () => ({

    }),
    watch: {},
    methods: {
      modelToView : function(model, callBack) {
        let res

        if(model) {
          res = model.map((responses) => {
            return Array.from({length: 4}, (v, k) => {
              const label = String.fromCharCode(65 + k)
              return (
                responses.includes(label) ? {label : label, color : 'green'} : {label : label, color : 'red'}
              )
            })
          }) 
        }

        if(callBack)
          callBack(res)
      },
      viewToModel: function(userResponses, defaultResponses, callBack) {
        let v1, v2

        if(defaultResponses) {
          v1 = Array.from({length: 40}, (v, k) => {
            const keys = Object.keys(userResponses ? userResponses : {})
            return  userResponses && keys.some(e => Number(e) === k) ? userResponses[k] : []
          })

          v2 = defaultResponses.map((res) => {
            return res.map((res2) => {
              return res2.color === 'red' ? '' : res2.label
            }).filter(element => element !== '')
          })
        }

        if(callBack)
          callBack({v1 : v1, v2: v2})
      },
      getDefaultResponse : function(numberOfQuestions, propsByQuestion) {
        let responses = []

        if(numberOfQuestions !== undefined) {
          responses = Array.from({length: numberOfQuestions}, () => {
            return Array.from({length: propsByQuestion}, (v1, k1) => { 
              const label = String.fromCharCode(65 + k1)
              return k1 ? {label : label, color : 'red'} : {label : label, color : 'red'}
            })
          })
        }

        return responses
      },
      evaluateResponses : function(userResponses, defaultResponses, callBack) {
        let evalRes, dResponses, dLen, uLen

        if(defaultResponses && userResponses) {
          evalRes = userResponses.map((uResponses, index) => {
          dResponses = defaultResponses[index]
          
          dLen = dResponses ? dResponses.length : 0
          uLen = uResponses ? uResponses.length : 0

          return uLen !== 0 && dLen === uLen && !dResponses.some(
              dResponse => !uResponses.some(uResponse => dResponse === uResponse)
            ) ? 1 : 0
          })

          if(callBack)
            callBack(evalRes.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0))
        }
      },
      responsesToParameter : function({userResponses, defaultResponses}, callBack) {
        let dates = [], values = []

        if(userResponses && defaultResponses) {
          userResponses.forEach((response) => {
            Object.keys(response).forEach((date) => {
              this.evaluateResponses(response[date], defaultResponses, (res) => {
                dates.push(date)
                values.push(res)
              })
            })
          })
          if(callBack)
            callBack({name : this.playerVideoId, x : dates, y : values, color : 'rgba(245, 40, 145, 0.8)'})
        }   
      },
      responsesToData : function(v1, v2, videoId, callBack) {
        let currentResponses = {}
        const {vResponse} = this.$store.state.trafficlawstore
        let userResponses = vResponse && vResponse.userResponses ? vResponse.userResponses : []

        if(v1) {
          currentResponses[new Date().toISOString()] = v1
          userResponses = [...userResponses, currentResponses]
        }

        if(v2) {
          callBack({
            folderName : process.env.VUE_APP_DRIVE_FOLDER,
            fileName : videoId + ".json",
            data : {
              videoId : videoId,
              userResponses : userResponses,
              defaultResponses : v2
            }
          })
        }
      },
    }
}
