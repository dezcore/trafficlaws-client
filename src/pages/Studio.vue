<template>
  <NavBar 
    :channelId="channelId" 
    :view="view"
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
      setView : function(view, channelId) {
        this.view = view
        
        if(channelId)
          this.channelId = channelId
      }
    }
  }
</script>
