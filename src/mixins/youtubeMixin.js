import {
  loadClient, 
  execute, 
  getVideosData,
  executeByFilter,
  apiDurationToDate
} from "../youtube/index"

export default {
    data: () => ({
      filters : [
        "date", 
        "viewCount"
      ]
    }),
    methods : {
      execute,
      loadClient,
      getVideosData,
      executeByFilter,
      apiDurationToDate,
      yRequest : function(channelId, searchField, nextPageToken, type, callBack) {
        this.execute(["snippet"], channelId, searchField, type, nextPageToken, (response) => {
          if(response)
            callBack(response)
        })
      },
      setChannels : function(channels, append, callBack) {
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

          if(append && callBack)
            callBack([...this.channels, ...chnls])
          else if(callBack)
            callBack(chnls)
        }
      },
      getMoreChannels : function(channelId, searchField, nextPageToken, callBack) {
        loadClient((message) => {
          if(message && nextPageToken) {
            this.yRequest(channelId, searchField, nextPageToken, ["channel"], (response) => {
              if(response.items) {
                this.setChannels(response.items, true, (channels) => {
                  if(callBack)
                    callBack(channels, response.nextPageToken)
                })
              }
            })
          }
        })
      },
      searchChannels : function(channelId, searchField, nextPageToken, callBack) {
        loadClient((message) => {
          if(message && searchField && searchField !== '') {
            this.execute(["snippet"], channelId, searchField, ["channel"], nextPageToken, (response) => {
              if(response.items) {
                this.setChannels(response.items, false, (channels) => {
                  if(callBack)
                    callBack(channels, response.nextPageToken)
                })
              }
            })
          }
        })
      },
      setPlayList : function(items, type, append, callBack) {
        let videos

        if(items) {
          videos = items.map((item) => {
            return({
              id : type === 'Videos' ? item.id.videoId : item.snippet.channelId,
              title : item.snippet.title,
              date : item.snippet.publishedAt,
              description : item.snippet.description,
              src : item.snippet.thumbnails.medium.url,
              channelId : item.snippet.channelId,
              channelTitle : item.snippet.channelTitle,
              publishedAt : item.snippet.publishedAt,
              duration : this.apiDurationToDate(item.contentDetails.duration)
            })
          })

          if(append && callBack)
            callBack([...this.videos, ...videos])
          else
            callBack(videos)
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
              callBack(items, response.nextPageToken)
          })
        }
      },
      getMoreVideos : function(channelId, searchField, nextPageToken, callBack) {
        loadClient((message) => {
          if(message && nextPageToken) {
            this.yRequest(channelId, searchField, nextPageToken, ["video"], (response) => {
              this.addVideosDetails(response, (items) => {
                if(items) {
                  this.setPlayList(items, 'Videos', true, callBack)
                }
              })
            })
          }
        })
      },
      searchVideos : function(searchField, callBack) {
        let parameters
        let date = new Date();
        date.setDate(date.getDate()-10)

        loadClient((message) => {
          if(message) {
            this.nextPageToken = null

            parameters = {
              part : ["snippet"],
              channelId : this.currentChannelId,
              q : searchField,
              type : ["video, playlist"],
              pageToken : null,
              maxResult : 5,
              order: this.filter,
              publishedAfter :  date.toISOString()
            }

            this.executeByFilter(parameters, (response) => {  
              this.addVideosDetails(response, (items, nextPageToken) => {
                if(items) {
                  this.setPlayList(items, 'Videos', false, (videos) => {
                    if(callBack)
                      callBack(videos, nextPageToken)
                  })
                }
              })            
            })
          }
        })
      },
      showChannelVideos : function(channelId, filter, callBack) {
        loadClient((message) => {
          if(message) {            
            this.executeByFilter({
                part : ["snippet"],
                channelId : channelId,
                type : ["video, playlist"],
                maxResult : 5,
                order: filter ? filter : this.filter
              }, (response) => {  
              this.addVideosDetails(response, (items, nextPageToken) => {
                if(items) {
                  this.setPlayList(items, 'Videos', false, (channels) => {
                    if(callBack)
                      callBack(channels, nextPageToken)
                  })
                }
              })            
            })
          }
        })
      },
    }
}