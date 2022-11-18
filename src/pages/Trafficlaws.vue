<template>
<DualLayout 
  :tabs="tabs" 
  :tabIndex="tabIndex"
>
  <template #videoPlayer>
    <VideoPlayer 
      :height="height"
      :videos="videos" 
      :playerVideoId="playerVideoId"
    />
  </template>
  <template #videoPlayList1>
    <VideoPlayList
      :height="height"
      :vertical="true" 
      :videos="videos"
      :numberOfItems="numberOfVideo"
      :getNextVideos="getNextVideos"
      :updatePlayer="updatePlayer"
      :playerVideoId="playerVideoId"
    />  
  </template>
  <template #videoPlayList2>
     <VideoPlayList
        :height="height"
        :vertical="true"
        :showChannel="true"  
        :channels="channels"
        :numberOfItems="numberOfVideo"
        :playerVideoId="playerVideoId"
        :getNextChannels="getNextChannels"
        :displayChannelVideos="displayChannelVideos"
      />
  </template>
  <template #videoQCM>
    <VideoQCM 
      :height="height"
      :responses="responses"
      :editMode="editMode"
      :videoId="playerVideoId"
      :enableEditMode="enableEditMode"
      :resetResponses="resetResponses"
    />
  </template>
   <template #videoStates>
    <VideoStates 
      :nbrQuestions="nbrQuestions"
    />
   </template>
</DualLayout>
</template>
<script>
  import DualLayout from "../layouts/DualLayout.vue"
  import VideoQCM from "../components/VideoQCM.vue"
  import VideoStates  from "../components/VideoStates.vue"
  import VideoPlayer from "../components/VideoPlayer.vue"
  import VideoPlayList from "../components/VideoPlayList.vue"
  import {serializeObj} from "../plugins/files"
  import {loadClient, execute} from "../youtube"

  export default {
    name: 'Trafficlaws',
    components : {
      DualLayout,
      VideoQCM,
      VideoStates,
      VideoPlayer,
      VideoPlayList
    },
    data: () => ({
      height : 528,
      videos : [],
      channels : [],
      editMode : false, 
      playerVideoId : 'M7lc1UVf-VE',
      tabs : ['Videos', 'Channels', 'QCM', 'Stats'],
      tabIndex : {value : 0},
      channelId : null,
      nbrQuestions: 40,
      numberOfVideo : 5,
      nextPageToken : null,
      channelNextPageToken : null,
      response : [
        {label : 'A', color : 'red'},
        {label : 'B', color : 'red'},
        {label : 'C', color : 'red'},
        {label : 'D', color : 'red'},
      ],
      responses : [],
      videosResponses : []
    }),
    watch : {
      '$store.state.trafficlawstore.searchField' : {
        handler: function() {
          const {searchField} = this.$store.state.trafficlawstore
          if(searchField && (this.tabs[this.tabIndex.value] === 'Videos' || this.tabs[this.tabIndex.value] === 'Channels')) {
            this.searchVideos(searchField)
            this.searchChannels(searchField)
          }
        },
        immediate : true
      }
    },
    beforeMount() {
      this.initResponses()
    },
    mounted () {
      this.searchVideos('Arte')
      this.searchChannels('Arte')
    },
    methods : {
      execute,
      loadClient,
      serializeObj,
      initResponses : function() {
        this.responses = Array.from({length: this.nbrQuestions}, (v, k) => k ? this.response.slice() : this.response.slice())
      },
      updatePlayer : function(playerVideoId) {
        if(playerVideoId) {
          this.playerVideoId = playerVideoId
        }
      },
      getVideoResponse : function(videoId) {
        if(videoId) {
          //videosResponses
          console.log("videoId : ", videoId)
        }
      },
      searchVideos : function(searchField) {
        loadClient((message) => {
          if(message) {
            this.nextPageToken = null
            this.execute(["snippet"], this.channelId, searchField, ["video"], null, (response) => {
              this.videos = response.items
              if(this.videos[0] && this.videos[0].id) {
                this.nextPageToken = response.nextPageToken
                this.playerVideoId = this.videos[0].id.videoId                  
              }
            })
          }
        })
      },
      searchChannels : function(channelName) {
        loadClient((message) => {
          if(message && channelName && channelName !== '') {
            this.channelNextPageToken = null
            this.execute(["snippet"], this.channelId, channelName, ["channel"], this.channelNextPageToken, (response) => {
              if(response.items) {
                this.channelNextPageToken = response.nextPageToken
                this.channels = response.items
              }
            })
          }
        })
      },
      getNextChannels : function() {
        const {searchField} = this.$store.state.autocodestore

        loadClient((message) => {
          if(message && this.channelNextPageToken) {
            this.execute(["snippet"], this.channelId, searchField, ["channel"], this.channelNextPageToken, (response) => {
              if(response.items) {
                this.channelNextPageToken = response.nextPageToken                
                response.items.forEach((item)=>{
                  if(!this.channels.some(channel => channel.snippet.channelId === item.snippet.channelId)) {
                    this.channels = [...this.channels, item]
                  }
                })
              }
            })
          }
        })
      },
      displayChannelVideos : function(channelId) {
        loadClient((message) => {
          if(message && channelId) {
            this.nextPageToken = null
            this.channelId = channelId
            this.execute(["snippet"], channelId, null, ["video"], this.nextPageToken, (response) => {
              this.videos = response.items
              if(this.videos[0] && this.videos[0].id) {
                this.nextPageToken = response.nextPageToken
                this.playerVideoId = this.videos[0].id.videoId                  
              }
              this.tabIndex = {value : 0}
            })
          }
        })
      },
      getNextVideos : function(searchField) {
        loadClient((message) => {
          if(message && this.nextPageToken) {
            this.execute(["snippet"], this.channelId, searchField, ["video"], this.nextPageToken, (response) => {
              if(response.items) {
                this.nextPageToken = response.nextPageToken                
                response.items.forEach((item)=>{
                  if(!this.videos.some(video => video.id.videoId === item.id.videoId)) {
                    this.videos = [...this.videos, item]
                  }
                })
              }
            })
          }
        })
      },
      enableEditMode : function() {
        this.editMode = !this.editMode
      },
      editResponses : function() {
        if(this.responses) {
          this.serializeObj(this.responses, "responses.json", (res)=>{
            console.log("editResponses : ", res, this.responses)
          })
        }
      },
      resetResponses : function() {
        this.initResponses()
      }
    }
  }
</script>
