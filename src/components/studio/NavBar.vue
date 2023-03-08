<template>
  <v-card flat>
    <v-toolbar
      flat
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </v-toolbar>
  
    <v-card
      class="mx-auto"
      style="margin-top: -64px;"
    >
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">
          Studio
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="6">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title class="grey--text">
                Bar1
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu offset-y :close-on-content-click="false"  v-if="currentView === 'videosView' || currentView === 'channelsView'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs"  v-on="on">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </template>
                <v-card class="pa-2">
                  <v-text-field
                    hide-details
                    rounded
                    clearable
                    label="Search"
                    v-model="searchField"
                    append-outer-icon="mdi-magnify"
                    color="black"
                    background-color="white"
                    @click:append-outer="setSearchField({key : 'Enter'})"
                    @keydown="setSearchField"
                  ></v-text-field>
                </v-card>
              </v-menu>
              <v-menu offset-y :close-on-content-click="false"  v-if="currentView === 'videosView' || currentView === 'channelsView'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs"  v-on="on">
                    <v-icon>mdi-search-web</v-icon>
                  </v-btn>
                </template>
                <v-card class="pa-2">
                  <v-text-field
                    hide-details
                    rounded
                    clearable
                    label="Search by URL"
                    v-model="urlField"
                    append-outer-icon="mdi-magnify"
                    color="black"
                    background-color="white"
                    @click:append-outer="setUrlField({key : 'Enter'})"
                    @keydown="setUrlField"
                  ></v-text-field>
                </v-card>
              </v-menu>
              <v-btn icon  
                v-if="currentView === 'videosView' || currentView === 'channelsView'"
                @click="currentView === 'videosView' ? getMoreVideos(searchField) : getModeChannels(searchField)"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-btn icon 
                v-if="currentView === 'cutsView'"
                @click="setDownloadDialog"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
           </v-toolbar>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title class="grey--text">
                Bar2
              </v-toolbar-title>
               <v-spacer></v-spacer>
              <v-btn icon @click="setShowDialog">
                <v-icon>mdi-scissors-cutting</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <slot name="players" :playList="videos" :channels="channels"></slot> 
        </v-col>
      </v-row>
    </v-card>
    <slot name="footer"></slot>
    <VideosCutForm
      :videoId="videoId"
      :dialog="showDialog"
      :setShowDialog="setShowDialog"
    />
  </v-card>
</template>
<script>
  import {
    loadClient, 
    execute, 
    getVideosData,
    apiDurationToDate
  } from "./../../youtube/index"  
  
  import VideosCutForm  from "../studio/VideosCutForm.vue"

  export default {
    name: 'NavBar',
    props : {
      channelId : {
        type : String,
        default : ()=>{return null}
      },
      view : {
        type : String,
        default : ()=>{return null}
      }
    },
    components : {
      VideosCutForm
    },
    data () {
      return {
        cuts : 0,
        channels : [],
        videoId : null,
        showDialog : false,
        currentChannelId : null,
        urlField : '',
        searchField : '',
        videos : [
          {
            title : "test1",
            id : "11-lpoJHu0U",
            src : "https://picsum.photos/id/11/500/300"
          },
          {
            title : "test2",
            id : "QPG1D9iiB-I",
            src : "https://picsum.photos/id/11/500/300"
          },
        ],
        currentView : "videosView",
        nextPageToken : null,
        channelNextPageToken : null
      }
    },
    watch : {
      view : function() {
        if(this.view) {
          this.currentView = this.view
        }
      },
      channelId : function() {
        if(this.channelId) {
          this.showChannelVideos(this.channelId)
        }
      }
    },
    methods : {
      execute,
      loadClient,
      getVideosData,
      apiDurationToDate,
      setDownloadDialog : function() {
        this.$store.commit("updateDownloadDialog", true)
      },
      setShowDialog : function() {
        this.showDialog = !this.showDialog
      },
      setUrlField: function(event) {
        let url_parse, videoId, channel

        if(event && event.key === 'Enter') {
          url_parse = new URL(this.urlField)
          videoId = url_parse.searchParams.get('v')
          channel = url_parse.searchParams.get('ab_channel')

          if(videoId) 
            this.videoId = videoId

          if(channel) {
            this.searchVideos(channel)
            this.searchChannels(channel)
          }
        }
      },
      setSearchField: function(event) {
        if(event && event.key === 'Enter') {
          this.currentChannelId = null
          this.searchVideos(this.searchField)
          this.searchChannels(this.searchField)
        }
      },
      setChannels : function(channels, append) {
        let chnls

        if(channels) {
          chnls = channels.map((channel)=>{
            return {
              id : channel.snippet.channelId,
              title : channel.snippet.channelTitle,
              description : channel.snippet.description,
              src : channel.snippet.thumbnails.default.url
            }
          })

          if(append)
            this.channels = [...this.channels, ...chnls]
          else
            this.channels = chnls
        }
      },
      searchChannels : function(searchField) {
        loadClient((message) => {
          if(message && searchField && searchField !== '') {
            this.channelNextPageToken = null
            this.execute(["snippet"], this.currentChannelId, searchField, ["channel"], this.channelNextPageToken, (response) => {
              if(response.items) {
                this.channelNextPageToken = response.nextPageToken
                this.setChannels(response.items)
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
      getModeChannels : function(searchField) {
        loadClient((message) => {
          if(message && this.channelNextPageToken) {
            this.yRequest(this.currentChannelId, searchField, this.channelNextPageToken, ["channel"], (response) => {
              if(response.items) {
                this.setChannels(response.items, true)
              }
            })
          }
        })
      },
      setPlayList : function(items, type, append) {
        let videos

        if(items) {
          videos = items.map((item) => {
            return({
              id : type === 'Videos' ? item.id.videoId : item.snippet.channelId,
              title : item.snippet.title,
              date : item.snippet.publishedAt,
              description : item.snippet.description,
              src : item.snippet.thumbnails.medium.url,
              duration : this.apiDurationToDate(item.contentDetails.duration)
            })
          })

          if(append)
            this.videos = [...this.videos, ...videos]
          else
            this.videos = videos
        }
      },
      addVideosDetails: function(response, callBack) {
        let videosId, items, targetItem

        if(response) {
          videosId  = response.items.map(vItem=> vItem.id.videoId)
          this.getVideosData(videosId, ["contentDetails"], (data) => {
            items = response.items.map((vItem) => {
              targetItem = data.items.find(dItem => dItem.id === vItem.id.videoId)          
              if(targetItem)
                vItem.contentDetails = targetItem.contentDetails
              else
                vItem.contentDetails = {}
              return vItem
            })

            if(callBack)
              callBack(items)
          })

          this.nextPageToken = response.nextPageToken
        }
      },
      searchVideos : function(searchField) {
        loadClient((message) => {
          if(message) {
            this.nextPageToken = null
            this.execute(["snippet"], this.currentChannelId, searchField, ["video"], null, (response) => {  
              this.addVideosDetails(response, (items)=>{
                if(items) {
                  this.setPlayList(items, 'Videos')
                }
              })            
            })
          }
        })
      },
      getMoreVideos : function(searchField) {
        loadClient((message) => {
          if(message && this.nextPageToken) {
            this.yRequest(this.channelId, searchField, this.nextPageToken, ["video"], (response) => {
              this.addVideosDetails(response, (items) => {
                if(items) {
                  this.setPlayList(items, 'Videos', true)
                }
              })
            })
          }
        })
      },
      showChannelVideos : function(channelId) {
        loadClient((message) => {
          if(message && channelId) {
            this.nextPageToken = null
            this.currentChannelId = channelId
            this.execute(["snippet"], channelId, null, ["video"], this.nextPageToken, (response) => {
              this.addVideosDetails(response)
            })
          }
        })
      },
    }
  }
</script>
