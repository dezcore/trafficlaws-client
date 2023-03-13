<template>
<div>
  <v-card height="500" class="overflow-auto">
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(item, index) in playList"
          :key="item.id + index"
          :cols="3"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-card v-bind="attrs" v-on="on">
                <v-img
                  :src="item.src"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  @click="changeVideo(item.id, item.title)"
                  height="200px"
                >
                  <v-card-title v-text="item.duration"></v-card-title>
                </v-img>
                <v-card-title class="pa-0 text-h6">
                  <div class="headerClass">
                    {{item.title}}
                  </div>
                </v-card-title>
              </v-card>
            </template>
            <span>
              <p>Title : {{item.title}}</p>
              <p> Published at  : {{item. publishedAt}}</p>
              <p>Description : {{item.description}}</p>
              <p>Channel : {{item.channelTitle}}</p>
            </span>
          </v-tooltip>
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
