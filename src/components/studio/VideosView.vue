<template>
<div>
  <v-card height="500" class="overflow-auto">
    <v-container fluid>
      <v-row dense>
        <v-col
           v-for="{id, src, title, duration} in playList"
           :key="id"
          :cols="3"
        >
          <v-card>
            <v-img
              :src="src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
               @click="changeVideo(id, title)"
              height="200px"
            >
              <v-card-title v-text="duration"></v-card-title>
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
</div>
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
.headerClass{
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}
</style>
