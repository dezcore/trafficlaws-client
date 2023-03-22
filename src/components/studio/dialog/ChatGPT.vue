<template>
<FloatDialog
  :width="1000"
  :showDialog="dialog"
  :setShowDialog="setShowDialog"
  title="ChatGPT"
>
  <template #content>
    <v-card-text>
    <OpenAI/>
    </v-card-text>
  </template>
</FloatDialog>
</template>

<script>
  import FloatDialog from "./FloatDialog.vue"
  import OpenAI from "../../../pages/OpenAI.vue"
  
  export default {
    name: 'ChatGPT',
    components : {
      OpenAI,
      FloatDialog
    },
    props : {
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      setShowDialog : {
        type : Function,
        default : () => {}
      }
    },
    data () { 
      return {
        progress : "",
        showProgress : false
      }
    }
  }
</script>
