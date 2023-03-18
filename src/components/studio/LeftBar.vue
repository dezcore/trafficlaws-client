<template>
  <v-navigation-drawer
    permanent
    hide-overlay
  >
    <v-list
      nav
      dense
    >
      <v-list-item link @click="setView('videosView')">
        <v-list-item-icon>
          <v-icon>mdi-youtube</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Videos</v-list-item-title>
      </v-list-item>
      <v-list-item link @click="setView('channelsView')">
        <v-list-item-icon>
          <v-icon>mdi-view-grid</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Channels</v-list-item-title>
      </v-list-item>
      <v-list-item link @click="resetCounter">
        <v-list-item-icon>
          <v-badge
            :content="cuts"
            :value="cuts"
            color="green"
            overlap
          >
            <v-icon>mdi-filmstrip-box-multiple</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title @click="setView('cutsView')">
          Cuts
        </v-list-item-title>
      </v-list-item>
      <v-list-item link @click="setShowDialog">
        <v-list-item-icon>
          <v-icon>mdi-scissors-cutting</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Congiguration</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <FloatDialog
      title="Cut video" 
      :showDialog="showDialog"
      :setShowDialog="setShowDialog"
    >
      <template #form="{dialog}">
        <VideosCutForm 
          :dialog="dialog"
          :setCounter="setCounter"
        />
      </template>
    </FloatDialog>
  </v-navigation-drawer>
</template>
<script>
  import FloatDialog from "./dialog/FloatDialog.vue"
  import VideosCutForm  from "../studio/VideosCutForm.vue"

  export default {
    name: 'LeftBar',
    props : {
      setView : {
        type : Function,
        default : () => {}
      }
    },
    components : {
      FloatDialog,
      VideosCutForm
    },
    data () {
      return {
        cuts : 0,
        showDialog : false,
      }
    },
    methods : {
      setShowDialog : function() {
        this.showDialog = !this.showDialog
      },
      resetCounter : function() {
        this.cuts = 0
        this.setView('cutsView')
      },
      setCounter : function() {
        this.cuts++
      }
    }
  }
</script>
