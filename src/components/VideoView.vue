<template>
<div>
  <v-card
    dark
    v-for="item in playList"
    :key="item.id"
    class="pa-2"
    :color="item.id === playerVideoId ? 'green' : 'white'"
    @click="updatePlayer(item.id)" 
  >
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-img
        max-width="168"
        class="pa-2"
        :src="item.src"
      >
      </v-img>
      <div>    
        <div>
          <span class="overflow-y-hidden black--text">
            {{item.title}}
          </span>
        </div>
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
  export default {
    name: 'VideoView',
    props : {
      playerVideoId : {
        type : String,
        default : ()=>{return ''}
      },
      playList : {
        type : Array,
        default : ()=>{return []}
      },
      updatePlayer : {
        type : Function,
        default : ()=>{}
      }
    },
    data: () => ({}),
    methods : {}
  }
</script>

<style scoped>
</style>