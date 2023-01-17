<template>
  <div
    ref="graph"
    :id="chartId"
    :key="componentKey"
  >
  </div>
</template>
<script>
  import parameter from "./mixins/parameter"
  import configuration from "./mixins/configuration"
  
  export default {
    name: 'Chart',
    components : {},
    props : {
      point : {
        type : Object,
        default : ()=>{return null}
      },
      parameters : {
        type : Array,
        default : ()=>{return [
          {name : "default", x : [], y : [], color : 'rgba(245, 40, 145, 0.8)'}
        ]}
      }
    },
     watch : {
      point : function() {
        if(this.point) {
          this.removeTracePoint(this.point)
        }
      }, 
      parameters : {
        handler : function(newParameters, oldParameters) {
          this.addParameters(newParameters, oldParameters)
        },
        immediate : true
      },
      '$store.state.trafficlawstore.vResponse' : {
        handler: function() {
          const {vResponse} = this.$store.state.trafficlawstore

          if(vResponse && vResponse.defaultResponses && vResponse.defaultResponses.length === 0) {
            this.removeTrace([{name : vResponse.videoId}])
          }

        },
        immediate : true
      },
    },
    mixins : [
      parameter,
      configuration
    ],
    data: () => ({
      chartId : "chart",
      componentKey : 1
    }),
    methods : {
      refreshChart : function() {
        this.componentKey++
      },
      addParameters : function(newParameters, oldParameters) {
        if(Object.keys(this.layout).length === 0) {
          this.initCharts(newParameters[0], () => {
             this.initParameters(newParameters, 0)
          })
        } else {
          this.removeTrace(oldParameters, () => {
            this.initParameters(newParameters, 0)
            //this.refreshChart()
          }) 
        }
      }
    }
  }
</script>

<style scoped>
</style>