<template>
<div class="text-center">
    <v-menu
      open-on-hover
      top
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <slot name="VideoMenu"
          :vOn="on" 
          :attrs="attrs" 
        >
        </slot>
      </template>
      <iframe id="inlineFrameExample"
        title="Inline Frame Example"
        width="300"
        height="200"
        :src="'http://www.youtube.com/embed/' + videoId">
      </iframe>
    </v-menu>
  </div>
</template>
<script>

  export default {
    name: 'VideoMenu',
    components : {
    },
    props : {
      videoId : {
        type : String,
        default : ()=>{return "M7lc1UVf-VE"}
      }
    },
    data: () => ({

    }),
    watch : {
    
    },
    methods : {

    }
  }
</script>

<style scoped>
</style>