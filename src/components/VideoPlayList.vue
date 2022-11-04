<template>
<div>
  <PlayListLayout 
    :videoView="!showChannel"
  >
    <template #VideoView>
      <VideoView 
        :playList="playList"
        :updatePlayer="updatePlayer"
      />
    </template>
    <template #ChannelView>
      <ChannelView 
        :playList="playList"
        :displayChannelVideos="displayChannelVideos"
      />
    </template>
  </PlayListLayout>
  <MoreVideoButton 
    :nextVideos="nextVideos"
  />
</div>
</template>

<script>
  import MoreVideoButton from "./MoreVideoButton.vue"
  import ChannelView from "./ChannelView.vue"
  import VideoView from "./VideoView.vue"
  import PlayListLayout from "./../layouts/PlayListLayout.vue"

  export default {
    name: 'VideoPlayList',
    components : {
      ChannelView,
      MoreVideoButton,
      VideoView,
      PlayListLayout
    },
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