export default {
    data: () => ({}),
    watch: {},
    methods: {
      resTreatment : function(responses, callBack) {
        //let res = {}
        //let date = new Date().toISOString()
        let userResponses, defaultResponses
        if(responses && responses.userResponses) {
          userResponses = Array.from({length: 40}, (v, k) => {
            const keys = Object.keys(responses.userResponses)
            return  keys.some(e => Number(e) === k) ? responses.userResponses[k] : []
          })

          defaultResponses = responses.defaultResponses.map((res) => {
            return res.map((res2) => {
              return res2.color === 'red' ? '' : res2.label
            }).filter(element => element !== '')
          })
        }

        if(callBack)
          callBack({userResponses : userResponses, defaultResponses : defaultResponses})
      },
      resDbFormat : function(responses, callBack) {
        if(responses) {
          this.resTreatment(responses, ({userResponses, defaultResponses}) => {
            if(callBack)
              callBack({
                videoId : responses.videoId,
                userResponses : userResponses,
                defaultResponses : defaultResponses,
              })
          })
        }
      },
      evalUserRes : function(defaultResponses, date, userResponses, callBack) {
        let qsResponse, res

        if(defaultResponses && userResponses && callBack) {
          res = defaultResponses.map((resArray, index) => {
            qsResponse = date ? userResponses[date][index] : userResponses[index]
            
            return (resArray.some((val)=>{
              return qsResponse.length !== 0 && !qsResponse.some(e => e !== val)
            }) ? 1 : 0)

          })
          callBack(res.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0))
        } else {
          return callBack(0)
        }
      },
      responsesToParameter : function({userResponses, defaultResponses}, callBack) {
        let dates = [], values = []

        if(userResponses && defaultResponses) {
          userResponses.forEach((response) => {
            Object.keys(response).forEach((date) => {
              this.evalUserRes(defaultResponses, date, response, (value) => {
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
