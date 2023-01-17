<template>
  <v-row>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on : deletedialog, attrs }">
        <slot name="dialogButton"  :attrs="attrs" :deletedialog="deletedialog"></slot>
      </template>
      <v-card>
        <v-card-title>Delete Folder</v-card-title>
        <v-card-text>{{message}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="remove"
          >
            OK
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
           Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    name: 'DeleteDialog',
    props : {
      item : {
        type : Object,
        default : () => {return null}
      },
      message : {
        type : String,
        default : () => {return "Do want to delete folder"}
      },
      videoId : {
        type : String,
        default : () => {return null}
      },
      removeFolder : {
        type : Function,
        default : () => {}
      },
      removeFile : {
        type : Function,
        default : () => {}
      },
      removeElement : {
        type : Function,
        default : () => {}
      }
    },
    data: () => ({
      dialog: false
    }),
    watch : {},
    methods : {
      remove : function () {
        this.dialog = false

        if(this.item)
          this.removeElement(this.item)
        else if(this.videoId)
          this.removeFile(this.videoId)
      }
    }
  }
</script>
<style scoped>
</style>