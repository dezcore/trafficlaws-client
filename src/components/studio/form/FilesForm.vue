<template>
<div>
  <v-row>
    <v-col cols="9">
      <v-select
        v-model="selected"
        :items="files"
        label="Files name : "
        item-text="name"
        item-value="name"
        outlined
        multiple
        @click="()=>{}"
        return-object
      ></v-select>
    </v-col>
    <v-col cols="3">
      <div class="mt-3 ml-2">
        <v-icon  @click="deleteFiles(0, selected)">mdi-delete</v-icon>
      </div>
    </v-col>
  </v-row>
</div>
</template>
<script>
  export default {
    name: 'FilesForm',
    components : {},
    props : {
      files : {
        type : Array,
        default : () => {return []}
      },
      deleteFiles :{
        type : Function,
        default : () => {}
      }
    },
    data () { 
      return {
        selected : []
      }
    },
    methods : {

    }
  }
</script>
