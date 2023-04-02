<template>
  <NavBar 
    :channelId="channelId" 
    :view="view"
    :setView="setView"
  >
   <template #players="{playList, channels}">
     <Players
      :setView="setView" 
      :playList="playList"
      :channels="channels"
      :view="view"
    />
   </template>
   <template #footer> 
     <Footer :setView="setView"/>
    </template>
</NavBar>
</template>

<script>
  import Footer from "../components/studio/Footer.vue"
  import NavBar from "./../components/studio/NavBar.vue" 
  import Players from "./../components/studio/Players.vue"

  export default {
    name: 'Studio',
    components : {
      NavBar,
      Players,
      Footer
    },
    data () {
      return {
        channelId : null,
        view : 'videosView'
      }
    },
    methods : {
      setView : function(view, channel) {
        this.view = view
        if(channel) {
          this.channelId = channel.id
        }
      }
    }
  }
</script>
