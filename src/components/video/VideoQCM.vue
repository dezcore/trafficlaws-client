<template>
<QCMLayout :responses="defaultResponses">
  <template #Qs="{i}">
    <strong class="d-flex align-center pa-2">{{i+1}}.</strong>
    <v-checkbox
      v-model="seleted"
      v-for="j in questions.length" 
      :key="j"
      :label="questions[j-1]"
      :value="questions[j-1]+ i"
      class="pa-1"
    ></v-checkbox>
  </template>
  <template #Rs="{i, res}">
    <v-card 
      v-for="k in res.length"
      :color="res[k-1].color"
      class="d-flex justify-center align-center mt-4"
      :key="'r' + (res.length * (i-1) + k)"
      height="30" 
      width="30"
      @click="setResponseColor(i, k)"
    >
      {{res[k-1].label}}
    </v-card>
  </template>
</QCMLayout>
</template>
<script>

  import QCMLayout from "../../layouts/QCMLayout.vue"
  import apiMixin from "../../mixins/apiMixin"
  import responseMixin from "../response/mixin/responseMixin"

  export default {
    name: 'VideoQCM',
    components : {
      QCMLayout
    },
    props : {
      height : {
        type : Number
      },
      editMode : {
        type : Boolean
      },
      videoId : {
        type : String
      },
      responses : {
        type : Array,
        default : ()=>{return []}
      },
    },
    data: () => ({
      numRegex : /\d*/g,
      alphaRegex : /[A-Z]/g,
      seleted : [],
      nbrQuestions: 40,
      userResponses : {},
      questions : ['A', 'B', 'C', 'D'],
      currentArchives : [],
      currentResponses : [],
      defaultResponses : []
    }),
    mixins : [
      apiMixin,
      responseMixin
    ],
    watch : {
      '$store.state.trafficlawstore.vResponse' : {
        handler: function() {
          const {vResponse} = this.$store.state.trafficlawstore

          const defaultResponses = vResponse ? vResponse.defaultResponses : null
          
          if(defaultResponses && defaultResponses.length === 0) {
            this.defaultResponses = this.getDefaultResponse(40, 4)
          }
        },
        immediate : true
      },
      '$store.state.trafficlawstore.showResponse' : {
        handler: function() {
          const {showResponse, defaultResponses} = this.$store.state.trafficlawstore
          
          if(showResponse && defaultResponses && 0 < defaultResponses.length) {
            this.defaultResponses = defaultResponses
          } else {
            this.defaultResponses = this.getDefaultResponse(40, 4)
          }
        },
        immediate : true
      },
      seleted :  {
        handler: function(selected, oldSelected) {
          let type
          
          if(oldSelected && selected) {
            type = oldSelected.length < selected.length ? 'add' : 'remove'

            if(type === 'add')
              this.addResponse(selected)
            else
              this.removeResponse(selected, oldSelected)
          }
        },
        immediate : true
      },
      responses : {
        handler: function() {
          if(this.responses) {
            const {showResponse, defaultResponses} = this.$store.state.trafficlawstore
            this.defaultResponses = showResponse ? defaultResponses : this.getDefaultResponse(40, 4) 
          }
        },
        immediate : true
      }
    },
    methods : {
      setResponseColor : function(i, k) {
        let color
        const {showResponse} = this.$store.state.trafficlawstore

        if(this.editMode && this.defaultResponses[i][k-1] && showResponse) {
          color = this.defaultResponses[i][k-1].color
          this.defaultResponses.splice(i, 1, this.defaultResponses[i].map((res, index ) => { 
            return index === k-1 ? { label : res.label , color : color === 'red'  ? 'green' : 'red'}  : res
          }))
          this.$store.commit("updateDefaultResponses", this.defaultResponses)
        }
      },
      addResponse : function(selected) {
        let numPart, alphaPart
        let lastElement = selected[selected.length-1]

        if(lastElement ) {
          numPart = lastElement.match(this.numRegex)[1]
          alphaPart = lastElement.match(this.alphaRegex)[0]

          if(this.userResponses[numPart] === undefined)
            this.userResponses[numPart] = []

          this.userResponses[numPart].push(alphaPart)
          this.$store.commit("updateUserResponses", this.userResponses)
        }
      },
      removeResponse : function(selected, oldSelected) {
        let numPart, alphaPart
        let targetElement =  oldSelected.find(response => !selected.some(res => res === response))

        if(targetElement) {
          numPart = targetElement.match(this.numRegex)[1]
          alphaPart = targetElement.match(this.alphaRegex)[0]
          this.userResponses[numPart] = this.userResponses[numPart].filter(element => element !== alphaPart)
          this.$store.commit("updateUserResponses", this.userResponses)
        }
      }
    }
  }
</script>