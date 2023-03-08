<template>
<v-tabs
  color="deep-purple accent-4"
  left
>
  <v-tab>Favorites channels</v-tab>
  <v-tab>Videos tendances</v-tab>
  <v-tab-item>
    <v-slide-group
      multiple
      show-arrows
    >
      <v-slide-item
        v-for="(item, index) in channels"
        :key="index"
        v-slot="{ active, toggle }"
      >
        <v-img
          :color="active ? undefined : 'grey lighten-1'"
          :src="item.src"
          @click="() => {
            toggle()
            switchChannel(item)
          }"
          height="140px"
          width="150px"
        >
          <v-scale-transition>
            <v-icon
              v-if="active"
              color="white"
              size="48"
              v-text="'mdi-close-circle-outline'"
            ></v-icon>
          </v-scale-transition> 
        </v-img>
      </v-slide-item>
    </v-slide-group>
   </v-tab-item>
</v-tabs>
</template>
<script>

  import apiMixin from "../../mixins/apiMixin"

  export default {
    name: 'VideosCut',
    props : {
      setView : {
        type : Function,
        default : () => {}
      },
      favoriteChannels : {
        type : Array,
        default : ()=>{return []}
      }
    },
    watch : {
      favoriteChannels : function() {
        if(this.favoriteChannels) {
          this.favoriteChannels.forEach((channel1) => {
            if(!this.channels.some(channel2 => channel1.id === channel2.id)) {
              this.channels.push(channel1)
            }
          })
          this.flushFavorites()
        }
      }
    },
    data () {
      return {
        channels : [],
        progress : false
      }
    },
    mixins : [
      apiMixin
    ],
    methods : {
      switchChannel : function(item) {
        if(item) {
          this.setView('videosView', item.id)
        }
      },
      flushFavorites : function() {
        let data = {
          folderName : "FavoriteChannels",
          fileName : "favorite",
          data : this.channels
        }
        this.postData(process.env.VUE_APP_API_URL + "/google/drive", data)
      }
    }
  }
</script>
