<template>
<v-card height="100px">
  <v-footer>
      <v-card
        flat
        tile
        width="100%"
        class="red lighten-1 text-center"
      >
        <v-card-text class="pa-4">
          <v-btn class="mr-2" text @click="setView('videosView')">
            <v-icon size="24px">
              mdi-youtube
            </v-icon>
            Videos
          </v-btn>
          <v-btn class="mr-2" text @click="setView('channelsView')">
            <v-icon size="24px">
              mdi-view-grid
            </v-icon>
            Channels
          </v-btn>

          <v-btn class="mr-2" text @click="setView('cutsView')">
            <v-badge
              :content="cuts"
              :value="cuts"
              color="green"
              overlap
            >
              <v-icon size="24px"> mdi-filmstrip-box-multiple</v-icon>
            </v-badge>
            Cuts
          </v-btn>
          <v-btn class="mr-2" text @click="setShowDialog">
            <v-icon size="24px">
              mdi-forum
            </v-icon>
            ChatGPT
          </v-btn>
        </v-card-text>
        <ChatGPT 
          :dialog="dialog"
          :setShowDialog="setShowDialog"
        />
      </v-card>
    </v-footer>
</v-card>
</template>
<script>
  import ChatGPT from "./dialog/ChatGPT.vue"

  export default {
    name: 'Footer',
    components : {
      ChatGPT
    },
    props : {
      setView : {
        type : Function,
        default : () => {}
      }
    },
    watch : {
      '$store.state.trafficlawstore.cuts' : {
        handler: function(cuts/*, oldCuts*/) {
          //let oldCpt = oldCuts ? oldCuts.length : 0
          //const {cuts} = this.$store.state.trafficlawstore
          if(cuts) {
            //console.log("oldCuts : ", oldCuts)
            this.cuts = cuts.length
          }
        },
        immediate : true
      }
    },
    data () {
      return {
        cuts : 28,
        dialog : false
      }
    },
    methods : {
      resetCounter : function() {
        this.cuts = 0
        this.setView('cutsView')
      },
      setShowDialog : function() {
        this.dialog = !this.dialog
      }
    }
  }
</script>
