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
    <v-tab>
      Waiting 
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-title   v-bind="attrs" v-on="on">
                {{'title : '+ item.title + ', format : ' + item.format + ', duration : ' + item.duration}} 
              </v-list-item-title>
            </template>
             <span> {{'title : '+ item.title + ', format : ' + item.format + ', duration : ' + item.duration + ", format : " + item.format}}</span>
          </v-tooltip>
          
          <v-row>
            <v-col cols="10"  class="pr-0">
              <v-progress-linear
                v-model="item.progress"
                height="28"
              >
                <strong>{{item.progress}}%</strong>
              </v-progress-linear>
            </v-col>
            <v-col cols="2" class="pa-0 mt-3">
              <v-icon @click="stopDownload(item)">mdi-stop</v-icon>
              <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
            </v-col>
          </v-row>
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
    <v-tab-item>
      <v-card flat>
         <v-list-item  
          v-for=" (item, index) in waitList"
          :key="item.videoId + index"
        >
        <v-list-item-content>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-title   v-bind="attrs" v-on="on">
                {{'title : '+ item.title + ', format : ' + item.format + ', duration : ' + item.duration}} 
              </v-list-item-title>
            </template>
            <span> {{'title : '+ item.title + ', format : ' + item.format + ', duration : ' + item.duration + ", format : " + item.format}}</span>
          </v-tooltip>
          <v-row>
            <v-col cols="10"  class="pr-0">
              <v-progress-linear
                :value="item.progress"
                height="28"
                aria-disabled=""
              >
                <strong>{{item.progress}}%</strong>
              </v-progress-linear>
            </v-col>
            <v-col cols="2" class="pa-0 mt-3">
              <v-icon @click="restoreItem(item)">mdi-replay</v-icon>
              <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      </v-card>
    </v-tab-item>
  </v-tabs-items>
</v-card>
</template>
<script>
  import apiMixin from "../../../mixins/apiMixin"

  export default {
    name: 'DownloadDialog',
    props : {
      stopAll : {
        type : Boolean,
        default : ()=>{return false}
      },
      currentDownloadItem : {
        type : Object,
        default : ()=>{return null}
      },
      waitingList : {
        type : Array,
        default : ()=>{return []}
      },
      completeDownload : {
        type : Array,
        default : ()=>{return []}
      },
      downloadStack : {
        type : Array,
        default : () => {return []}
      },
      restoreItem : {
        type : Function,
        default : ()=>{}
      },
      stopDownloadItem : {
        type : Function,
        default : ()=>{}
      },
      removeCut : {
        type : Function,
        default : ()=>{}
      }
    },
    watch : {
      stopAll : {
        handler : function(){
          if(this.stopAll) {
            this.cuts = []
            this.stopProgress = true
          }
        },
        immediate : true
      },
      completeDownload : {
        handler : function() {
          if(this.completeDownload) {
            this.downloaded = this.completeDownload.map((cut) => {return {...cut, progress : 100}})
            this.cuts = this.cuts.filter(cut =>  !this.existItem(this.downloaded, cut))
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
          const url = process.env.VUE_APP_API_URL + "/google/youtube/download/progress"

          if(this.currentDownloadItem)
            this.getProgress(url, this.currentDownloadItem)
        },
        immediate : true
      },
      waitingList : {
        handler : function() {
          if(this.waitingList) {
            this.waitList = Object.assign([], this.waitingList)
          }
        },
        immediate : true
      }
    },
    data () {return {
      cuts : [],
      tab: null,
      waitList : [],
      downloaded : [],
      stopProgress : false,
    }},
    mixins : [
      apiMixin
    ],
    methods : {
      sameItem : function(item1, item2) {
        let res = false

        if(item1 && item2) {
          res = (
            item1.videoId === item2.videoId && item1.duration === item2.duration &&
              item1.startSeconds === item2.startSeconds &&  item1.endSeconds ===  item2.endSeconds && item1.format === item2.format
          )
        }

        return res
      },
      existItem : function(cuts, item) {
        return (
          cuts.some(cut => 
            cut.videoId === item.videoId && cut.duration === item.duration &&
            cut.startSeconds === item.startSeconds &&  cut.endSeconds ===  item.endSeconds && cut.format === item.format
          )
        )
      },
      setItemProgress : function(item, progress) {
        if(item) {
          this.cuts = this.cuts.map((cut)=>{
            if(cut.videoId === item.videoId && cut.duration === item.duration &&
              cut.startSeconds === item.startSeconds &&  cut.endSeconds === item.endSeconds && cut.format === item.format) {
                return {...cut, progress : progress}
            } else {
              return cut
            }

          })
        }
      },
      deleteItem : function(item) {
        if(item) {
          
          if(this.sameItem(this.currentDownloadItem, item))
            this.stopProgress = true

          this.cuts = this.cuts.filter(cut =>  !this.sameItem(cut, item))
          this.removeCut(item)
          //this.stopDownloadItem(item)
        }
      },
      stopDownload : function(item) {
        if(item) {
          this.stopDownloadItem(item, true)
        }
      },
      getProgress : function(url, item) {
        let progress
        console.log("getProgress : ", this.stopProgress)
        if(item && item.videoId /*&& !this.stopProgress*/) {
          this.getData(url + "?videoId=" + item.videoId + '&format=' + item.format, (response) => {
              if(response) {
                progress = Number(response.download)
                this.setItemProgress(item, progress) 

                if(this.progress !== 100) {
                  setTimeout(() => {
                    this.getProgress(url, item)
                  }, 2000)
                }
              }
            })
        } else {
          this.stopProgress = false
        }
      },
    }
  }
</script>
