<template>
<QCMLayout :responses="responses">
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
      @click="setResponse(i, k)"
    >
      {{res[k-1].label}}
    </v-card>
  </template>
</QCMLayout>
</template>
<script>

  import QCMLayout from "../layouts/QCMLayout.vue"
  import apiMixin from "../mixins/apiMixin"

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
      currentArchives : [] 
    }),
    mixins : [
      apiMixin
    ],
    watch : {
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
            this.$store.commit("updateResponses", {
              userResponses : this.userResponses, 
              defaultResponses : this.responses,
              videoId : this.videoId
            })
          }
        },
        immediate : true
      }
    },
    methods : {
      setResponse : function(i, k) {
        let color

        if(this.editMode && this.responses[i][k-1]) {
          color = this.responses[i][k-1].color
          this.responses.splice(i, 1, this.responses[i].map((res, index ) => { 
            return index === k-1 ? { label : res.label , color : color === 'red'  ? 'green' : 'red'}  : res
          }))
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
          
          this.$store.commit("updateResponses", {
            userResponses : this.userResponses, 
            defaultResponses : this.responses,
            videoId : this.videoId
          })
        }
      },
      removeResponse : function(selected, oldSelected) {
        let numPart, alphaPart
        let targetElement =  oldSelected.find(response => !selected.some(res => res === response))

        if(targetElement) {
          numPart = targetElement.match(this.numRegex)[1]
          alphaPart = targetElement.match(this.alphaRegex)[0]
          this.userResponses[numPart] = this.userResponses[numPart].filter(element => element !== alphaPart)

          this.$store.commit("updateResponses", {
            userResponses : this.userResponses, 
            defaultResponses : this.responses,
            videoId : this.videoId
          })
        }
      }
    }
  }
</script>
<style scoped>
.fill-width {
  overflow-x: auto;
  flex-wrap: nowrap;
}
</style>