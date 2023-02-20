<template>
  <v-navigation-drawer
    permanent
    hide-overlay
  >
    <v-list
      nav
      dense
    >
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-view-grid</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Channel</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-star</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Starred</v-list-item-title>
      </v-list-item>
      <v-list-item link @click="setVideosView(true)">
        <v-list-item-icon>
          <v-icon>mdi-youtube</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Videos</v-list-item-title>
      </v-list-item>
      <v-list-item link @click="setVideosView(false)">
        <v-list-item-icon>
          <v-icon>mdi-filmstrip-box-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Cuts</v-list-item-title>
      </v-list-item>
      <v-list-item link @click="setShowDialog">
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Congiguration</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <FloatDialog 
      :showDialog="showDialog"
      :setShowDialog="setShowDialog"
    />
  </v-navigation-drawer>
</template>
<script>
  import FloatDialog from "../studio/FloatDialog.vue"

  export default {
    name: 'LeftBar',
    props : {
      setVideosView : {
        type : Function,
        default : () => {}
      }
    },
    components : {
      FloatDialog
    },
    data () {
      return {
        showDialog : false
      }
    },
    methods : {
      setShowDialog : function() {
        this.showDialog = !this.showDialog
      }
    }
  }
</script>
