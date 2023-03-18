<template>
<div class="mb-1">
  <v-row justify="space-around" v-for="(item, index) in playList" :key="index" class="pa-1">
  <v-card width="400">
    <v-img
      height="130px"
      src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
       @click="changeVideos(item.id, 0)"
    >
      <v-card-title class="white--text mt-8">
        <v-avatar size="56">
          <img
            alt="user"
            :src="item.src"
          >
        </v-avatar>
        <p class="ml-3">
          {{item.title}}
        </p>
      </v-card-title>
    </v-img>
  </v-card>
  </v-row>
</div>
</template>
<script>
  export default {
    name: 'ChannelView',
    props : {
      playList : {
        type : Array,
        default : ()=>{return []}
      },
      changeVideos : {
        type : Function,
        default : ()=>{}
      }
    },
    data: () => ({
    }),
    methods : {}
  }
</script>

<style scoped>
</style>