<template>
  <v-card :height="50" outlined>
    <v-card-actions>
      <v-btn
        color="deep-black lighten-2"
        text
        @click="nextVideos()"
      >
        More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'MoreVideoButton',
    props : {
      nextVideos : {
        type : Function,
        default : ()=>{}
      }
    },
    data: () => ({

    }),
    methods : {
      
    }
  }
</script>

<style scoped>
</style>