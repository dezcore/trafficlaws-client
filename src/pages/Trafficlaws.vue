<template>
  <v-container>
  <DualLayout 
    :tabs="tabs"     
    :tabIndex="tabIndex"
    :responses="responses"
    :videoId="playerVideoId"
    :enableEditMode="enableEditMode"
    :resetResponses="resetResponses"
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
      :changeVideos="changeVideos"
      :numberOfItems="numberOfVideo"
      :playerVideoId="playerVideoId"
      :nextPageToken="nextPageToken"
      :getNextChannels="getNextChannels"
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
      :nbrQuestions="nbrQuestions"
      :playerVideoId="playerVideoId"
    />
  </template>
</DualLayout>
 </v-container>
</template>
<script>
  import { mapActions } from 'vuex'
  import apiMixin from "../mixins/apiMixin"
  import fileMixin from "../mixins/fileMixin"
  import youtubeMixin from "../mixins/youtubeMixin"
  import {serializeObj} from "../plugins/files"
  import {loadClient, execute } from "../youtube"
  import VideoQCM from "../components/video/VideoQCM.vue"
  import DualLayout from "../layouts/DualLayout.vue"
  import VideoPlayer from "../components/video/VideoPlayer.vue"
  import VideoStates  from "../components/state/VideoStates.vue"
  import VideoPlayList from "../components/video/VideoPlayList.vue"
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
      responses : []
    }),
    mixins : [
      apiMixin,
      fileMixin,
      youtubeMixin,
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
            
            this.searchVideos(searchField, (videos, nextPageToken) => {
              this.videos = videos
              if(this.videos[0] && this.videos[0].id) {
                this.nextPageToken = nextPageToken
                this.playerVideoId = this.videos[0].id.videoId                  
              }
            })

            this.channelNextPageToken = null
            this.searchChannels(this.channelId, searchField, this.channelNextPageToken, (channels, nextPageToken)=>{
              if(channels) {
                this.channelNextPageToken = nextPageToken
                this.channels = channels
              }
            })
          }
        },
        immediate : true
      }
    },
    mounted () {
      window.addEventListener("load",() => {
        this.getFile(this.settingsFile, (config) => {
          if(config && config.playListFile) {
            this.getFile(config.playListFile, (playList) => {
              if(playList)
                this.videos = playList
              //this.nextPageToken = response.nextPageToken
              //this.playerVideoId = response.playerVideoId
              //this.channelNextPageToken = response.nextPageToken
              //this.channels = response.channels

            })
          }
        })
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
      initResponses : function() {      
        const {vResponse} = this.$store.state.trafficlawstore

        if(vResponse) {
          this.modelToView(vResponse.defaultResponses, (view) => {
            this.responses = view
          })
        } else {
          this.responses = this.getDefaultResponse(40, 4)
        }

        this.$store.commit("updateDefaultResponses", this.responses)
      },
      getVideoResponses : function(playerVideoId) {
        if(playerVideoId) {
          this.getFile(playerVideoId + ".json", (response) => {
            this.$store.commit("updateVResponse", response)
            this.initResponses()
          })
        }
      },
      resetResponses : function() {
        const {vResponse} = this.$store.state.trafficlawstore

        if(vResponse && vResponse.defaultResponses) {
          this.modelToView(vResponse.defaultResponses, (view) => {
            this.$store.commit("updateDefaultResponses", view)
            this.responses = Object.assign([], view)
          })
        }
      },
      updatePlayer : function(playerVideoId) {
        if(playerVideoId) {
          this.playerVideoId = playerVideoId
        }
      },
      getNextChannels : function() {
        const {searchField} = this.$store.state.trafficlawstore

        this.getMoreChannels(this.channelId, searchField, this.channelNextPageToken, (channels, nextPageToken) => {
          this.channels = channels
          this.channelNextPageToken = nextPageToken 
        })
      },
      changeVideos : function(channelId) {
        if(channelId) {
          this.nextPageToken = null
          this.showChannelVideos(channelId, null, (videos, nextPageToken) => {
            this.videos = videos
            if(this.videos[0] && this.videos[0].id) {
              this.nextPageToken = nextPageToken
              this.playerVideoId = this.videos[0].id.videoId                  
            }
            this.tabIndex = {value : 0}
          })
        }
      },
      getNextVideos : function(searchField) {
        this.getMoreVideos(this.channelId, searchField, this.nextPageToken, (videos, nextPageToken) => {
          this.videos = videos
          this.nextPageToken = nextPageToken
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
