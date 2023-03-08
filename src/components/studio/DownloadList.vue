<template>
<v-card height="500" class="overflow-auto">
  <v-tabs
    v-model="tab"
    background-color="primary"
    dark
  >
    <v-tab>
      In progress
    </v-tab>
    <v-tab>
      Downloaded 
    </v-tab>
  </v-tabs>

  <v-tabs-items v-model="tab">
    <v-tab-item>
      <v-card flat>
        <v-list-item  
          v-for=" (item, index) in cuts"
          :key="item.videoId + index"
        >
        <v-list-item-content>
          <v-list-item-title>
            {{'title : '+ item.title + ', format : ' + item.format + ', duration : ' + item.duration}} 
          </v-list-item-title>
          <v-progress-linear
            v-model="item.progress"
            height="28"
          >
            <strong>{{item.progress}}%</strong>
          </v-progress-linear>
        </v-list-item-content>
      </v-list-item>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <v-list-item  
          v-for=" (item, index) in downloaded"
          :key="item.videoId + index"
        >
        <v-list-item-content>
          <v-list-item-title>
            {{'title : '+ item.title + ', format : ' + item.format + ', duration : ' + item.duration}} 
          </v-list-item-title>
          <v-progress-linear
            v-model="item.progress"
            height="28"
          >
            <strong>{{item.progress}}%</strong>
          </v-progress-linear>
        </v-list-item-content>
      </v-list-item>
      </v-card>
    </v-tab-item>
  </v-tabs-items>
</v-card>
</template>
<script>
  import apiMixin from "../../mixins/apiMixin"

  export default {
    name: 'DownloadList',
    props : {
      currentDownloadItem : {
        type : Object,
        default : ()=>{return null}
      },
      completeDownload : {
        type : Array,
        default : ()=>{return []}
      },
      downloadStack : {
        type : Array,
        default : () => {return []}
      }
    },
    watch : {
      completeDownload : {
        handler : function() {
          if(this.completeDownload) {
            this.downloaded = this.completeDownload.map((cut) => {return {...cut, progress : 100}})
          }
        },
        immediate : true
      },
      downloadStack : {
        handler : function() {
          if(this.downloadStack)
            this.cuts = this.downloadStack.map((cut) => {return {...cut, progress : 0}})
            
          if(this.currentDownloadItem && !this.existItem(this.completeDownload, this.currentDownloadItem))
            this.cuts.unshift(this.currentDownloadItem)
        },
        immediate : true
      },
      currentDownloadItem : {
        handler: function() {
          if(this.currentDownloadItem) {
            this.getProgress(this.currentDownloadItem)
          }
        },
        immediate : true
      },
    },
    data () {return {
      cuts : [],
      tab: null,
      downloaded : []
    }},
    mixins : [
      apiMixin
    ],
    methods : {
      existItem : function(cuts, item) {
        return (
          cuts.some(cut => 
            cut.videoId === item.videoId && cut.duration === item.duration &&
            cut.startSeconds === item.startSeconds &&  cut.endSeconds ===  item.endSeconds
          )
        )
      },
      setItemProgress : function(item, progress) {
        if(item) {
          this.cuts = this.cuts.map((cut)=>{
            if(cut.videoId === item.videoId && cut.duration === item.duration &&
              cut.startSeconds === item.startSeconds &&  cut.endSeconds ===  item.endSeconds) {
                return {...cut, progress : progress}
            } else {
              return cut
            }

          })
        }
      },
      getProgress : function(item) {
        let progress
        const url = process.env.VUE_APP_API_URL + "/google/youtube/download/progress"
        
        if(item && item.videoId) {
          this.getData(url + "?videoId=" + item.videoId + '&format=' + item.format, (response) => {
              if(response) {
                progress = Number(response.download)
                this.setItemProgress(item, progress) 

                if(this.progress !== 100) {
                  setTimeout(() => {
                    this.getProgress()
                  }, 2000)
                }
              }
            })
        }
      },
    },
  }
</script>
