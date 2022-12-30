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
      parameters : {
        type : Array,
        default : ()=>{return [
          {name : "default", x : [], y : [], color : 'rgba(245, 40, 145, 0.8)'}
        ]}
      }
    },
    data: () => ({
      chartId : "chart",
      componentKey : 1
    }),
    mixins : [
      parameter,
      configuration
    ],
    watch : {
       parameters : {
        handler : function() {
          this.addParameters()
        },
        immediate : true
      }
    },
    methods : {
      refreshChart : function() {
        this.componentKey++
      },
      addParameters : function() {
        this.initCharts(this.parameters[0], () => {
          this.initParameters(this.parameters, 0)
        })
        this.refreshChart()
      }
    }
  }
</script>

<style scoped>
</style>