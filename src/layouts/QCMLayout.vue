<template>
<v-card
  :height="height"
  outlined
  class="overflow-y-auto overflow-x-hidden"
>
  <v-container>
    <v-row class="fill-width">
      <v-col cols="6">
        <slot name="Qtitle"></slot>
      </v-col>
      <v-col cols="6">
        <slot name="Rtitle"></slot>
      </v-col>
    </v-row>
    <v-row class="fill-width">
      <v-col cols="12" sm="12">
        <v-row 
          v-for="(res, i) in responses" 
          :key="i"
          class="fill-width"
        >
          <slot name="Qs" :i="i"></slot>
          <div class="ml-5"></div>
          <slot name="Rs" :i="i" :res="res"></slot>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
export default {
  name: 'QCMLayout',
  props : {
    height : {
      type : Number,
      default : 450
    },
    responses : {
      type : Array,
      default : ()=>{return []}
    },
  },
  data: () => ({}),
  methods : {

  }
}
</script>
