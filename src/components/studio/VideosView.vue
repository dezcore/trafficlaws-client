<template>
<v-item-group mandatory>
       <v-card height="500" class="overflow-auto">
         <v-container>
        <v-row>
          <v-col
            v-for="{id, src, title, duration} in playList"
            :key="id"
            cols="12"
            md="4"
          >
            <v-card
              max-width="168"
            >

              <v-img
                max-width="168"
                class="white--text align-end"
                :src="src"
                @click="changeVideo(id, title)"
              >
                <v-card-title 
                  class="justify-end"
                  background-color="light-blue"
                >
            
                  {{duration}}
                </v-card-title>

              </v-img>
              <v-card-title class="pa-0 text-h6">
                <div class="headerClass">
                  {{title}}
                </div>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
       </v-card>
  </v-item-group>
</template>
<script>
  export default {
    name: 'VideosView',
    props : {
      playList : {
        type : Array,
        default : ()=>{return []}
      },
      changeVideo : {
        type : Function,
        default : ()=>{}
      }
    },
    methods : {}
  }
</script>

<style scoped>
.v-card {
  transition: opacity .8s ease-in-out;
}
.v-card:not(.on-hover) {
  opacity: 0.6;
}
.headerClass{
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}
</style>
