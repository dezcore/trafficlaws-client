<template>
<div>
  <v-card 
    v-if="vertical"
    :height="height"
    class="overflow-y-auto overflow-x-hidden"
  >
    <v-list three-line v-if="showChannel">
      <template v-for="(item, index) in playList">
        <v-divider :key="index"/>
        <v-list-item :key="item.id" @click="item.callBack(item.id)" >
          <v-list-item-avatar>
            <v-img :src="item.src"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
          </v-list-item-content>      
        </v-list-item>
      </template>
    </v-list>
    <v-card
      v-else
      dark
      v-for="item in playList"
      :key="item.id"
      class="pa-2"
      :color="item.id === playerVideoId ? 'green' : 'white'"
      @click="item.callBack(item.id)" 
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
    <v-card :height="50">
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
  </v-card>
  <v-slide-group
      v-else
      v-model="model"
      class="pa-4"
      active-class="success"
      show-arrows
      @click:prev="preVideos"
      @click:next="nextVideos"
    >
      <v-slide-item
        v-for="video in videos"
        :key="video.id.videoId"
      >
        <v-card 
          @click="updatePlayer(video.id.videoId)" 
          class="pa-1"
          :color="video.id.videoId === playerVideoId ? 'green' : 'grey'"
        >
          <v-img
            max-height="100"
            max-width="220"
            class="pa-2"
            :src="video.snippet.thumbnails.medium.url"
          >
          </v-img>
          <div style="width: 200px">
            <span class="overflow-y-hidden white--text">
              {{video.snippet.title}}
            </span>
          </div>
        </v-card>
    </v-slide-item>
</v-slide-group>
</div>
</template>

<script>
  export default {
    name: 'VideoPlayListH',
    props : {
      height : {
        type : Number
      },
      vertical : {
        type : Boolean,
        default : ()=>{return false}
      },
      showChannel : {
        type : Boolean,
        default : () => {return false}
      },
      currentTab : {
        type : String,
        default : () => {return ''}
      },
      channels : {
        type : Array,
        default : () => {return []}
      },
      videos : {
        type : Array,
        default : () => {return []}
      },
      updatePlayer : {
        type : Function,
        default : ()=>{}
      },
      getNextVideos : {
        type : Function,
        default : ()=>{}
      },
      getNextChannels : {
        type : Function,
        default : ()=>{}
      },
      displayChannelVideos : {
        type : Function
      },
      playerVideoId : {
        type : String
      },
      numberOfItems : {
        type : Number,
        default : () => {return 5}
      }
    },
    data: () => ({
      model : null,
      playList : [],
      cptItems : 0, 
    }),
    watch : {
      videos : {
        handler: function() {
          this.setPlayList(this.videos, 'Videos')
        },
        immediate : true
      },
      channels : {
        handler: function() {
          this.setPlayList(this.channels, 'Channels')
        },
        immediate : true
      }
    },
    methods : {
      setPlayList : function(items, type) {
        if(items) {
          this.playList = items.map((item) => {
            return({
              id : type === 'Videos' ? item.id.videoId : item.snippet.channelId,
              title : item.snippet.title,
              date : item.snippet.publishedAt,
              description : item.snippet.description,
              src : item.snippet.thumbnails.medium.url,
              callBack : type === 'Videos' ?  this.updatePlayer : this.displayChannelVideos
              //video.snippet.channelId
              //video.snippet.channelTitle
            })
          })

          if(items.length === this.numberOfItems)
            this.cptItems = 0
        }
      },
      preVideos : function() {
        this.cptItems -= 1
      },
      nextVideos : function() {
        this.cptItems += 1
        if((this.cptItems * this.numberOfItems) === this.playList.length) {
          if(!this.showChannel)
            this.getNextVideos()
          else
            this.getNextChannels()
        }
      }
    }
  }
</script>

<style scoped>
</style>