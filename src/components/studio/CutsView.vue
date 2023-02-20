<template>
<v-item-group mandatory>
       <v-card height="500" class="overflow-auto">
         <v-container>
        <v-row>
          <v-col
            v-for="{videoId, startSeconds, endSeconds, src} in cuts"
            :key="videoId"
            cols="12"
            md="4"
          >
            <v-card
              :color="active ? 'primary' : ''"
              :class="'d-flex align-center'"
              dark
              max-width="168"
            >
              <v-img
                max-width="168"
                class="pa-2"
                :src="src"
                @click="playCut(videoId, startSeconds, endSeconds)"
              >
              </v-img>
              <v-card-actions>
                <v-checkbox
                  v-model="selected"
                  :label="videoId"
                  :value="videoId"
                ></v-checkbox>
                  <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
       </v-card>
  </v-item-group>
</template>
<script>
  export default {
    name: 'CutsView',
    props : {
      cuts : {
        type : Array,
        default : ()=>{return []}
      },
      playCut : {
        type : Function,
        default : ()=>{}
      }
    },
     data () {
      return {
        selected: []
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
