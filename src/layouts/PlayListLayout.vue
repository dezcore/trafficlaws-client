<template>
  <v-card 
    outlined
    :height="height" 
    class="overflow-y-auto overflow-x-hidden"
  >
    <slot name="VideoView" v-if="videoView"></slot>
    <slot name="ChannelView" v-else></slot>
  </v-card>
</template>
<script>
export default {
  name: 'PlayListLayout',
  props : {
    height : {
      type : Number,
      default : 450
    },
    videoView : {
      type : Boolean,
      default : () => {return false}
    }
  },
  data: () => ({
  }),
  methods : {
  }
}
</script>
