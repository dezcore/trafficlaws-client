<template>
<NavBar>
   <template #leftBar>
    <LeftBar 
      :setVideosView="setVideosView"
    />
   </template>
   <template #players="{playList}">
     <Players 
      :playList="playList"
      :videosView="videosView"
    />
   </template>
</NavBar>
</template>

<script>
  import NavBar from "./../components/studio/NavBar.vue" 
  import LeftBar from "./../components/studio/LeftBar.vue"
  import Players from "./../components/studio/Players.vue"

  export default {
    name: 'Studio',
    components : {
      NavBar,
      LeftBar,
      Players
    },
     data () {
      return {
        videosView : true
      }
    },
    methods : {
      setVideosView : function(videosView) {
        this.videosView = videosView
      }
    }
  }
</script>
