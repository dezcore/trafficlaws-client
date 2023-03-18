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
        :changeVideos="changeVideos"
      />
    </template>
  </PlayListLayout>

  <VideosActions  
    :title="false"
    :videos="videos"
    :channels="channels"
    :nextVideos="nextVideos"
    :playerVideoId="playerVideoId"
    :nextPageToken="nextPageToken"
    :channelNextPageToken="channelNextPageToken"
  />
</div>
</template>

<script>
  import ChannelView from "./ChannelView.vue"
  import VideoView from "./VideoView.vue"
  import PlayListLayout from "../../layouts/PlayListLayout.vue"
  import VideosActions from "./menu/VideoActions.vue"

  export default {
    name: 'VideoPlayList',
    components : {
      ChannelView,
      VideoView,
      PlayListLayout,
      VideosActions
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
      nextPageToken : {
        type : String,
        default : ()=>{return ""}
      },
      getNextChannels : {
        type : Function,
        default : ()=>{}
      },
      channelNextPageToken : {
        type : String,
        default : ()=>{return ""}
      },
      changeVideos : {
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
          if(!this.showChannel && this.videos)
            this.playList = this.videos 
        },
        immediate : true
      },
      channels : {
        handler: function() {
          if(this.showChannel)
            this.playList = this.channels
        },
        immediate : true
      }
    },
    methods : {
      preVideos : function() {
        this.cptItems -= 1
      },
      nextVideos : function() {
        this.cptItems += 1
        if((this.cptItems * this.numberOfItems) === this.playList.length) {
          if(!this.showChannel)
            this.getNextVideos("")
          else
            this.getNextChannels("")
        }
      }
    }
  }
</script>

<style scoped>
</style>