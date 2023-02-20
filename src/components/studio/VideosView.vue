<template>
<v-item-group mandatory>
       <v-card height="500" class="overflow-auto">
         <v-container>
        <v-row>
          <v-col
            v-for="{id, src} in playList"
            :key="id"
            cols="12"
            md="4"
          >
            <v-item v-slot="{ active, toggle }">
              <v-hover v-slot="{ hover }">
                <v-card
                  :color="active ? 'primary' : ''"
                  :class="'d-flex align-center' + { 'on-hover': hover }"
                  dark
                  max-width="168"
                  @click="toggle"
                >

                  <v-img
                    max-width="168"
                    class="pa-2"
                    :src="src"
                    @click="changeVideo(id)"
                  >
                    <v-scroll-y-transition>
                      <div
                        v-if="active"
                        class="text-h2 flex-grow-1 text-center"
                      >
                        <v-icon>mdi-play</v-icon>
                      </div>
                    </v-scroll-y-transition>
                  </v-img>
              </v-card>
              </v-hover>
            </v-item>
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
</style>
