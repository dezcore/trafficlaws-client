<template>
  <v-card>
    <v-row class="text-center">
      <v-col cols="7">
        <v-tabs
          left
          class="pa-0"
          color="black accent-4"
        >
          <v-tab>
          </v-tab>
          <v-tab-item>
            <slot name="videoPlayer"></slot> 
          </v-tab-item>
        </v-tabs>
      </v-col>
      <v-col cols="5">
        <v-tabs
          left
          class="pa-0"
          v-model="currenTabIndex"
          color="black accent-4"
        >
          <v-tab 
            v-for="tab in tabs" 
            :key="tab"
          >
            {{tab}}
          </v-tab>
          <v-tab-item class="pa-0">
            <v-container fluid>
              <slot name="videoPlayList1"></slot> 
            </v-container>
          </v-tab-item>
          <v-tab-item class="pa-0">
            <v-container fluid>
              <slot name="videoPlayList2"></slot> 
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid>
              <slot name="videoQCM"></slot> 
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid>
              <slot name="videoStates"></slot> 
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>  
  </v-card>
</template>

<script>
export default {
  name: 'DualLayout',
  props : {
    tabs : {
      type : Array,
      default : ()=>{return []}
    },
    tabIndex : {
      type : Object,
      default : ()=>{return {value : 0}}
    }
  },
  data: () => ({
    currenTabIndex : 0
  }),
  watch : {
    tabIndex : {
      handler: function() {
        if(this.tabIndex)
          this.currenTabIndex = this.tabIndex.value
      },
      immediate : true
    }
  },
  methods : {}
}
</script>
