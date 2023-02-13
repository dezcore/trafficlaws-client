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

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
  
        <v-btn icon>
          <v-icon>mdi-apps</v-icon>
        </v-btn>
  
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="1">
          <slot name="leftBar"></slot> 
        </v-col>
        <v-col cols="11">
          <slot name="players" :playList="videos"></slot> 
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>
<script>
  import {loadClient, execute } from "./../../youtube/index"

  export default {
    name: 'NavBar',
    data () {
      return {
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
        nextPageToken : null
      }
    },
    methods : {
      execute,
      loadClient,
      setSearchField: function(event) {
      if(event && event.key === 'Enter') {
        this. searchVideos(this.searchField)
      }
        ///this.$store.commit("updateSearchField", this.searchField)
      },
       searchVideos : function(searchField) {
        loadClient((message) => {
          if(message) {
            this.nextPageToken = null
            this.execute(["snippet"], this.channelId, searchField, ["video"], null, (response) => {
              //this.videos = response.items
              this.setPlayList(response.items, 'Videos')
              //if(this.videos[0] && this.videos[0].id) {
                //this.nextPageToken = response.nextPageToken
                //this.playerVideoId = this.videos[0].id.videoId                  
              //}
            })
          }
        })
      },
      setPlayList : function(items, type) {
        if(items) {
          this.videos = items.map((item) => {
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
    }
  }
</script>
