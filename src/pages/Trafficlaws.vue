<template>
<DualLayout 
  :tabs="tabs"     
  :tabIndex="tabIndex"
  :responses="responses"
  :videoId="playerVideoId"
  :userArchives="userArchives"
  :enableEditMode="enableEditMode"
  :resetResponses="initResponses"
  :getVideoResponses="getVideoResponses"
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
      :channels="channels"
      :numberOfItems="numberOfVideo"
      :getNextVideos="getNextVideos"
      :updatePlayer="updatePlayer"
      :playerVideoId="playerVideoId"
       :nextPageToken="nextPageToken"
       :channelNextPageToken="channelNextPageToken"
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
         :nextPageToken="nextPageToken"
        :getNextChannels="getNextChannels"
        :displayChannelVideos="displayChannelVideos"
        :channelNextPageToken="channelNextPageToken"
      />
  </template>
  <template #videoQCM>
    <VideoQCM 
      :height="height"
      :editMode="editMode"
      :responses="responses"
      :videoId="playerVideoId"
      :enableEditMode="enableEditMode"
    />
  </template>
  <template #videoStates>
    <VideoStates 
      :vStates="vStates"
      :nbrQuestions="nbrQuestions"
      :playerVideoId="playerVideoId"
    />
  </template>
</DualLayout>
</template>
<script>
  import apiMixin from "../mixins/apiMixin"
  import DualLayout from "../layouts/DualLayout.vue"
  import VideoQCM from "../components/VideoQCM.vue"
  import VideoStates  from "../components/VideoStates.vue"
  import VideoPlayer from "../components/VideoPlayer.vue"
  import VideoPlayList from "../components/VideoPlayList.vue"
  import {serializeObj} from "../plugins/files"
  import {loadClient, execute } from "../youtube"
  import { mapActions } from 'vuex'
  import responseMixin from "../components/response/mixin/responseMixin"

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
      responses : [],
      vStates : {},
      userArchives : [],
      videosResponses : {}
    }),
    mixins : [
      apiMixin,
      responseMixin
    ],
    watch : {
      playerVideoId : function() {
        if(this.playerVideoId)
          this.getVideoResponses(this.playerVideoId)
      },
      tabIndex : function() {
        console.log("watch tabIndex : ", this.tabIndex)
      },
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
    mounted () {
      window.addEventListener("load",() => {
        this.getPlayList()
      })
    },
    created() {
      this.fetchCredential()
    },
    methods : {
      execute,
      loadClient,
      serializeObj,
       ...mapActions([
        'fetchCredential'
      ]),
       getFileByName : function(name, callBack) {
        let fileId
        const {tokens} = this.$store.state.trafficlawstore

        if(tokens) {
          this.getData(process.env.VUE_APP_API_URL + "/responses?name=" + name, (files) => {
            if(files[0]) {               
              fileId = files[0].id
              this.getData(process.env.VUE_APP_API_URL + "/download?fileId=" + fileId, (response) => {
                if(response && callBack)
                  callBack(response)                  
              })
            } else if(callBack) {
              callBack()
            }
          })
        } else if(callBack) {
          callBack()
        }
      },
      getVideoResponses : function(playerVideoId) {
        if(playerVideoId) {
          this.getFileByName(playerVideoId + ".json", (response) => {            
            if(response) {
              this.vStates = response
              this.videosResponses[response.videoId] = response
              this.userArchives = this.videosResponses[response.videoId].userResponses
            }

            this.initResponses()
          })
        }
      },
      getPlayList : function() {
        this.getFileByName("videos.json", (response) => {
          if(response) {
            this.videos = response.videos
            this.nextPageToken = response.nextPageToken
            this.playerVideoId = response.playerVideoId
            this.channelNextPageToken = response.nextPageToken
            this.channels = response.channels
          }
        })
      },
      initResponses : function() {        
        if(this.videosResponses && this.videosResponses[this.playerVideoId]) {
          this.responses = this.videosResponses[this.playerVideoId].defaultResponses.map((responses) => {
            return Array.from({length: 4}, (v, k) => {
              const label = String.fromCharCode(65 + k)
              return responses.includes(label) ? {label : label, color : 'green'} : {label : label, color : 'red'}
            })
          })
          
        } else {
          this.responses = this.getDefaultResponse(40, 4)
        }
      },
      updatePlayer : function(playerVideoId) {
        if(playerVideoId) {
          this.playerVideoId = playerVideoId
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
      yRequest : function(channelId, searchField, nextPageToken, type, callBack) {
        this.execute(["snippet"], channelId, searchField, type, nextPageToken, (response) => {
          if(response)
            callBack(response)
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
      setPageToken : function(type, {nextPageToken}) {
        if(type === "video" && nextPageToken) {
          this.nextPageToken = nextPageToken
        } else if(type === 'channel' && nextPageToken) {
          this.channelNextPageToken = nextPageToken 
        }
      },
      setChannelProps : function(type, response) {
        if(response && response.items) {
          this.setPageToken(type, response)
          response.items.forEach((item)=>{
            if(type === 'channel' && !this.channels.some(channel => channel.snippet.channelId === item.snippet.channelId)) {
              this.channels = [...this.channels, item]
            } else if(type === 'video' && !this.videos.some(video => video.id.videoId === item.id.videoId)) {
              this.videos = [...this.videos, item]
            }
          })
        }
      },
      getNextChannels : function() {
        const {searchField} = this.$store.state.trafficlawstore

        loadClient((message) => {
          if(message && this.channelNextPageToken) {
            this.yRequest(this.channelId, searchField, this.channelNextPageToken, ["channel"], (response) => {
              if(response)
                this.setChannelProps('channel', response)
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
            this.yRequest(this.channelId, searchField, this.nextPageToken, ["video"], (response) => {
              if(response)
                this.setChannelProps('video', response)
            })
          }
        })
      },
      enableEditMode : function() {
        this.editMode = !this.editMode
      },
      editResponses : function() {
        if(this.responses) {
          this.serializeObj(this.responses, "responses.json", (res) => {
            console.log("editResponses : ", res, this.responses)
          })
        }
      }
    }
  }
</script>
