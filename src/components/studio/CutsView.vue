<template>
<v-card height="500" class="overflow-auto">
  <v-container>
    <v-row>
      <v-col
        v-for=" (item, index) in cuts"
        :key="item.videoId + index"
        cols="12"
        md="4"
      >
        <v-card :color="item.format === 'mp3' ? 'primary' : 'red'">
          <v-img
            :src="item.src"
            class="white--text align-end"
            height="100"
            @click="playCut(item.videoId, item.startSeconds, item.endSeconds)"
          >
          <v-card-title 
            class="justify-end"
            background-color="light-blue"
          >
            
            {{item.duration}}
          </v-card-title>
          </v-img>
          <v-card-title class="pa-1">
            <div class="headerClass">
              {{item.title}}
            </div>
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-checkbox
                hide-details
                color="black"
                v-model="selected"
                class="shrink mt-0"
                :value="item"
              ></v-checkbox>
              <v-icon @click="editCut(item)">mdi-movie-open-edit-outline</v-icon>
              <v-icon @click="removeCut(item)">mdi-movie-open-remove-outline</v-icon>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <FloatDialog 
    title="EditCut" 
    :showDialog="dialog"
    :setShowDialog="setShowDialog"
  >
    <template #form="{dialog}">
      <EditCutForm 
        :save="save"
        :dialog="dialog"
        :editedItem="editedItem"
      />
    </template>
  </FloatDialog>
  <FloatDialog 
    title="Download" 
    :showDialog="downloadDialog"
    :setShowDialog="setDownloadDialog"
  >
    <template #form="{dialog}">
      <DownloadDialog 
        :dialog="dialog"
        :stopAll="stopAll"
        :removeCut="removeCut"
        :downloadStack="selected"
        :waitingList="waitingList"
        :restoreItem="restoreItem"
        :stopDownloadItem="stopDownloadItem"
        :completeDownload="completeDownload"
        :currentDownloadItem="currentDownloadItem"
      />
    </template>
    <template #buttons>
      <v-btn
        color="primary"
        text
        @click="startDownloads"
      >
        Start
      </v-btn>
      <v-btn
        color="primary"
        text
        @click="stopDownloads"
      >
        Stop
      </v-btn>
    </template>
  </FloatDialog>
</v-card>
</template>

<script>
  import apiMixin from "../../mixins/apiMixin"
  import fileMixin from "../../mixins/fileMixin"
  import FloatDialog from "./dialog/FloatDialog.vue"
  import EditCutForm from "../studio/EditCutForm.vue"
  import DownloadDialog from "./dialog/DownloadDialog.vue"

  export default {
    name: 'CutsView',
    components : {
      EditCutForm,
      FloatDialog,
      DownloadDialog
    },
    props : {
      cutsSelections : {
        type : Array,
        default : ()=>{return []}
      },
      playCut : {
        type : Function,
        default : ()=>{}
      }
    },
    watch : {
      '$store.state.trafficlawstore.downloadDialog' : {
        handler: function() {
          const {downloadDialog} = this.$store.state.trafficlawstore

          if(downloadDialog) {
            this.downloadDialog = downloadDialog
          }
        },
        immediate : true
      },
      '$store.state.studio.selectCuts' : {
        handler: function() {
          const {selectCuts} = this.$store.state.studio

          if(selectCuts) {
            this.selected = selectCuts.state ?  Object.assign([], this.cuts) : []
          }
        },
        immediate : true
      }, 
      '$store.state.studio.clearCuts' : {
        handler: function() {
          const {clearCuts} = this.$store.state.studio
          
          if(clearCuts) {
            this.stopAll = false
            this.stopDownload = false
            this.selected = []
            this.cuts = []
            this.$store.commit("updateCutsCpt", {value : this.cuts.length})
          }
        },
        immediate : true
      },  
      cutsSelections : {
        handler: function() {
          if(this.cutsSelections) {
            this.cuts = this.cutsSelections

            if(this.selected.length === 0)
              this.selected = []
            else
              this.selected = Object.assign([], this.selected)
          }
        },
        immediate : true
      },
      selected : {
        handler: function(selected) {
          if(selected)
            this.downloadStack = Object.assign([], selected)
        },
        immediate : true,
        deep : true 
      },
    },
    data () {
      return {
        cuts : [],
        stop : false,
        selected: [],
        dialog : false,
        editedItem : {},
        editedIndex: -1,
        defaultItem: {},
        downloading : false,
        downloadStack : [],
        completeDownload : [],
        downloadDialog : false,
        currentDownloadItem : null
      }
    },
    mixins : [
      apiMixin,
      fileMixin
    ],
    methods : {
      restoreItem : function (item) {
        let targetItem

        if(item) {
          if(!this.existItem(this.cuts, item))
            this.cuts.push(item)       
          
          targetItem = this.cuts.find(cut => this.sameItem(cut, item))
          
          if(targetItem)
            this.selected.push(targetItem)

          this.waitingList = this.waitingList.filter(item1 => !this.sameItem(item1, item))
        }
      }, 
      editCut : function(item) {
        this.editedIndex = this.cuts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      removeCut : function(item) {
        if(item) {
          this.editedIndex = this.cuts.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
          this.deleteItemConfirm(item)
          this.stopDownloadItem(item)
        }
      },
      deleteItemConfirm(item) {
        if(this.editedIndex !== -1)
          this.cuts.splice(this.editedIndex, 1)
        else if(item)
          this.cuts = this.cuts.filter(cut => !this.sameItem(cut, item))  
        this.closeDelete()
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
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
      stopDownloadItem : function(item2, save) {
        if(item2) {
          if(this.abortController && this.sameItem(this.currentDownloadItem, item2)) {
            this.stopDownload = true
            this.abortController.abort()
            this.currentDownloadItem = null
          }
          
          this.selected = this.selected.filter(item1 => !this.sameItem(item1, item2))
          //this.waitingList = this.waitingList.filter(item1 => !this.sameItem(item1, item2))
          if(save)
            this.waitingList.push(item2)
        }
      },
      stopDownloads : function () {
        this.stopAll = true

        if(this.abortController) {
          this.abortController.abort()
          this.selected = []
          this.currentDownloadItem = null
        }
      },
      startDownloads : function() {
        if(!this.downloading) {
          this.downloading = true
          console.log("startDownloads : ", this.selected)
          this.downloadCuts(() => {
            this.downloading = false
            if(this.stopAll)
              this.stopAll = false
          }) 
        }
      },
      downloadCuts : function(callBack) {
        let item

        if(0 < this.selected.length) {
          item = this.selected.pop()
          if(item && !this.existItem(this.completeDownload, item)) {
            this.stopDownload = false
            this.currentDownloadItem = item
            this.abortController = new AbortController()

            this.downloadFile({
              start : item.startSeconds,
              end : item.endSeconds,
              yUrl : item.yUrl,
              format : item.format,
              videoId : item.videoId,
              title : item.title
            }, this.abortController, () => {
              if(!this.stopAll && !this.stopDownload)
                this.completeDownload.push(item)

              if(!this.stopAll)
                this.downloadCuts()
            })
          } else if(!this.stopAll) {
            this.downloadCuts()
          } else if(callBack) {
            callBack()
          }
        }
      },
      setShowDialog : function() {
        this.dialog = !this.dialog
      },
      setDownloadDialog : function() {
        this.downloadDialog = !this.downloadDialog
         this.$store.commit("updateDownloadDialog", false)
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save(editedItem) {
        if(this.editedIndex > -1) {
          Object.assign(this.cuts[this.editedIndex], editedItem)
        } else {
          this.cuts.push(editedItem)
        }
        this.close()
      },
    }
  }
</script>

<style scoped>
.headerClass{
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}
</style>
