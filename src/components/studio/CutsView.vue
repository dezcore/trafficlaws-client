<template>
<v-card height="500" class="overflow-auto">
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="downloadCuts">
          Download
        </v-btn>
      </v-col>
      <v-col
        v-for=" (item, index) in cuts"
        :key="item.videoId + index"
        cols="12"
        md="4"
      >
        <v-card>
          <v-img
            :src="item.src"
            class="white--text align-end"
            max-width="168"
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
                v-model="selected"
                hide-details
                class="shrink mt-0"
                :value="item.videoId + index"
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
</v-card>
</template>

<script>
  import EditCutForm from "../studio/EditCutForm.vue"
  import FloatDialog from "../studio/FloatDialog.vue"

  export default {
    name: 'CutsView',
    components : {
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
      cutsSelections : {
        handler: function() {
          if(this.cutsSelections) {
            this.cuts = this.cutsSelections
          }
        },
        immediate : true
      }
    },
    data () {
      return {
        cuts : [],
        selected: [],
        dialog : false,
        editedItem : {},
        editedIndex: -1,
        defaultItem: {},
      }
    },
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
      downloadCuts : function() {
        console.log("downloadCuts")
      },
      setShowDialog : function() {
        this.dialog = !this.dialog
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
.v-card {
  transition: opacity .8s ease-in-out;
}
.v-card:not(.on-hover) {
  opacity: 0.6;
}
.headerClass{
  white-space: nowrap ;
  word-break: normal;
  overflow: hidden ;
  text-overflow: ellipsis;
}
</style>
