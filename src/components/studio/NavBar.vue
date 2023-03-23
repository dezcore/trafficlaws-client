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
                  <v-row>
                    <v-col cols="4" class="mr-0">
                      <v-select
                        v-model="filter"
                        :items="filters"
                        label="Filters"
                        outlined
                      ></v-select>
                    </v-col>
                    <v-col cols="8" class="ml-0">
                      <v-text-field
                         v-model="searchField"
                        label="Search"
                        outlined
                        clearable
                        append-outer-icon="mdi-magnify"
                        @click:append-outer="setSearchField({key : 'Enter'})"
                        @keydown="setSearchField"
                      ></v-text-field>
                    </v-col>
                  </v-row>
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
              <v-btn icon  @click="setView('channelsView')">
                <v-icon>mdi-star</v-icon>
              </v-btn>
              <v-btn icon  @click="clearCuts" v-if="currentView === 'cutsView'">
                <v-icon>mdi-backspace</v-icon>
              </v-btn>
              <v-btn icon  @click="selectCuts" v-if="currentView === 'cutsView'">
                <v-icon>mdi-select-all</v-icon>
              </v-btn>
              <v-btn icon  
                v-if="currentView === 'videosView' || currentView === 'channelsView'"
                @click="currentView === 'videosView' ? 
                getMoreVideos(currentChannelId, searchField, nextPageToken, setCurrentVideos) : 
                getMoreChannels(currentChannelId, searchField, channelNextPageToken, setCurrentChannels)"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-btn icon 
                v-if="currentView === 'cutsView'"
                @click="setDownloadDialog"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn icon  @click="setSettingDialog">
                <v-icon>mdi-cog</v-icon>
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
    <CutDialog
      :videoId="videoId"
      :dialog="showDialog"
      :setChannelId="setChannelId"
      :setShowDialog="setShowDialog"
    />
    <SettingForm
      :channels="channels" 
      :dialog="settingDialog"
      :setSettingDialog="setSettingDialog"
    />
  </v-card>
</template>
<script>
  import {
    loadClient, 
    execute, 
    getVideosData,
    executeByFilter,
    apiDurationToDate
  } from "./../../youtube/index"  

  import youtubeMixin from "../../mixins/youtubeMixin"
  import SettingForm from "../studio/SettingForm.vue"
  import CutDialog  from "./dialog/CutDialog.vue"

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
      },
      setView : {
        type : Function,
        default : ()=> {}
      }
    },
    components : {
      SettingForm,
      CutDialog
    },
    watch : {
      view : function() {
        if(this.view) {
          this.currentView = this.view
        }
      },
      channelId : function() {
        if(this.channelId) {
          this.showChannelVideos(this.channelId, this.filter, (videos, nextPageToken) => {
            this.videos = videos
            this.nextPageToken = nextPageToken
            this.currentChannelId = this.channelId
          })
        }
      }
    },
    data () {
      return {
        channels : [],
        videoId : null,
        showDialog : false,
        settingDialog : false,
        currentChannelId : null,
        urlField : '',
        searchField : '',
        videos : [],
        currentView : "videosView",
        nextPageToken : null,
        channelNextPageToken : null
      }
    },
    mixins : [
      youtubeMixin,
    ],
    methods : {
      execute,
      loadClient,
      getVideosData,
      executeByFilter,
      apiDurationToDate,
      setDownloadDialog : function() {
        this.$store.commit("updateDownloadDialog", true)
      },
      setShowDialog : function() {
        this.showDialog = !this.showDialog
      },
      setSettingDialog : function() {
        this.settingDialog = !this.settingDialog
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
            this.searchVideos(this.searchField, this.setCurrentVideos)
            this.searchChannels(this.currentChannelId, this.searchField,  this.channelNextPageToken, this.setCurrentChannels)
          }
        }
      },
      setSearchField: function(event) {
        if(event && event.key === 'Enter') {
          this.currentChannelId = null
          this.searchVideos(this.searchField, this.setCurrentVideos)
          this.searchChannels(this.currentChannelId, this.searchField,  this.channelNextPageToken, this.setCurrentChannels)
        }
      },
      setChannelId : function(id) {
        if(id && this.currentChannelId !== id) {
          this.currentChannelId = id
        }
      },
      setCurrentChannels : function(channels, nextPageToken) {
        this.channels = channels
        this.channelNextPageToken = nextPageToken
      },
      setCurrentVideos : function(videos, nextPageToken) {
        this.videos = videos
        this.nextPageToken = nextPageToken
      },
      selectCuts : function() {
        const {selectCuts} = this.$store.state.studio
        if(selectCuts) {
           this.$store.commit("updateSelectCuts", {state :!selectCuts.state})
        }
      },
      clearCuts : function() {
        const {clearCuts} = this.$store.state.studio
        if(clearCuts) {
          this.$store.commit("updateClearCuts", {state : true})
        }
      }
    }
  }
</script>
