<template>
<NavBar>
   <template #leftBar>
     <LeftBar/>
   </template>
   <template #players="{playList}">
     <Players :playList="playList" />
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
    methods : {}
  }
</script>
