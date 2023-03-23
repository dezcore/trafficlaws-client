<template>
<div>
  <v-card height="500" class="overflow-auto">
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(item, index) in currentPlayList"
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
                <v-card-text>
                  <v-row align="center">
                    <v-btn icon>
                      <v-icon size="24px" v-if="item.favorite" @click="addFavorite(item)">
                        mdi-star
                      </v-icon>
                      <v-icon size="24px" v-else @click="addFavorite(item)">
                        mdi-star-outline
                      </v-icon>
                    </v-btn>
                  </v-row>
                  </v-card-text>
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
      getFile : {
        type : Function,
        default : () => {}
      },
      postFile : {
        type : Function,
        default : () => {}
      },
      playList : {
        type : Array,
        default : ()=>{return []}
      },
      changeVideo : {
        type : Function,
        default : ()=>{}
      }
    },
    data () {
      return {
        currentConfig : {},
        currentPlayList : [],
        favoritesPlayList : null
      }
    },
    watch : {
      '$store.state.trafficlawstore.config' : {
        handler: function() {
          const {config} = this.$store.state.trafficlawstore

          if(config) {
            this.currentConfig = config

            if(config && this.favoritesPlayList === null) {
              this.getFile(config.playListFile, (favoritesPlayList) => {
                if(favoritesPlayList)
                  this.favoritesPlayList = favoritesPlayList
                  
                if(this.currentPlayList.length === 0 && favoritesPlayList)
                  this.currentPlayList = favoritesPlayList

                this.initFavorites()
              })
            }
          }
        },
        immediate : true
      },
      playList : {
        handler : function() {
          this.currentPlayList = Object.assign([], this.playList)
          this.initFavorites()
        },
        immediate : true
      }
    },
    methods : {
      initFavorites : function() {        
        if(this.playList && this.favoritesPlayList) {
          this.currentPlayList = this.currentPlayList.map((video) => {
            if(this.favoritesPlayList.some(fVideo => video.id === fVideo.id))
              video.favorite = true
            else
              video.favorite = false
            return video
          })
          this.$store.commit("updateCurrentPlayList", this.currentPlayList)
        }
      },
      flushPlayList : function() {
        const {appFolder, playListFile} = this.currentConfig

        if(appFolder && playListFile) {
          this.postFile(appFolder, playListFile, this.favoritesPlayList)
          this.$store.commit("updateCurrentPlayList", this.currentPlayList)
        }
      },
      removeFavorite : function(item) {
        if((!item.favorite) && this.favoritesPlayList.some(video => video.id === item.id)) {
          this.favoritesPlayList = this.favoritesPlayList.filter(video => video.id !== item.id)

          this.currentPlayList = this.currentPlayList.map((video) => {            
            if(video.id === item.id)
              video.favorite = false
            return video
          })
          
          this.flushPlayList()
        }
      },
      updateFavorite : function(item) {
        if(item.favorite && !this.favoritesPlayList.some(video => video.id === item.id)) {
          this.favoritesPlayList = [...this.favoritesPlayList, item]
          this.flushPlayList()
        } else {
          this.removeFavorite(item)
        }
      },
      addFavorite : function(item) {
        if(item) {
          this.currentPlayList = this.currentPlayList.map((video) => {
            if(video.id === item.id) {
              video.favorite = item.favorite ? !item.favorite : true
              item.favorite = video.favorite
            }
            return video
          })
          this.updateFavorite(item)
        }
      }
    }
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
