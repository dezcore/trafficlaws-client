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
      <DownloadList 
        :dialog="dialog"
        :downloadStack="selected"
        :completeDownload="completeDownload"
        :currentDownloadItem="currentDownloadItem"
      />
    </template>
    <template #buttons>
      <v-btn
        color="primary"
        text
        @click="downloadCuts"
      >
        Start
      </v-btn>
      <v-btn
        color="primary"
        text
        @click="()=>{}"
      >
        Stop
      </v-btn>
    </template>
  </FloatDialog>
</v-card>
</template>

<script>
  import EditCutForm from "../studio/EditCutForm.vue"
  import FloatDialog from "../studio/FloatDialog.vue"
  import apiMixin from "../../mixins/apiMixin"
  import DownloadList from "../studio/DownloadList.vue"

  export default {
    name: 'CutsView',
    components : {
      DownloadList,
      EditCutForm,
      FloatDialog
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
        handler: function() {
          if(this.selected) {
            this.downloadStack = Object.assign([], this.selected)
          }
        },
        immediate : true
      },
    },
    data () {
      return {
        cuts : [],
        selected: [],
        dialog : false,
        editedItem : {},
        editedIndex: -1,
        defaultItem: {},
        downloadStack : [],
        completeDownload : [],
        downloadDialog : false,
        currentDownloadItem : null
      }
    },
    mixins : [
      apiMixin
    ],
    methods : {
      editCut : function(item) {
        this.editedIndex = this.cuts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      removeCut : function(item) {
        this.editedIndex = this.cuts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
        this.deleteItemConfirm()
      },
      deleteItemConfirm () {
        this.cuts.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      existItem : function(cuts, item) {
        return (
          cuts.some(cut => 
            cut.videoId === item.videoId && cut.duration === item.duration &&
            cut.startSeconds === item.startSeconds &&  cut.endSeconds ===  item.endSeconds
          )
        )
      },
      downloadCuts : function() {
        let item

        if(0 < this.selected.length) {
          item = this.selected.pop()

          if(item && !this.existItem(this.completeDownload, item)) {
            this.currentDownloadItem = item
            this.getStream(process.env.VUE_APP_API_URL + "/google/youtube/download", {
              start : item.startSeconds,
              end : item.endSeconds,
              yUrl : item.yUrl,
              format : item.format,
              videoId : item.videoId,
              title : item.title
            }, () => {
              this.completeDownload.push(item)
              this.downloadCuts()
            })
          } else {
            this.downloadCuts()
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
