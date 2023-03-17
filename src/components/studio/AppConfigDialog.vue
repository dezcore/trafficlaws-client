<template>
<div>
  <v-progress-linear
    v-model="progress"
    height="28"
    v-if="showProgress"
  >
    <strong>{{progress}}%</strong>
  </v-progress-linear>
  <v-card-text>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="config.appFolder"
            label="App folder : "
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="config.configFile"
            label="Configuration file : "
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="config.favoritesFile"
            label="Favorites file : "
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <CategoriesForm 
            :setCategories="setCategories"
            :categories="categories"
          />
        </v-col>
        <v-col cols="12">
          <FilesForm 
            :files="files"
            :deleteFiles="deleteFiles"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-card-text>
</div>
</template>
<script>
  import FilesForm from "../studio/form/FilesForm.vue"
  import CategoriesForm from "../studio/form/CategoriesForm.vue"

  export default {
    name: 'AppConfigDialog',
    components : {
      FilesForm,
      CategoriesForm 
    },
    props : {
      initForm : {
        type : Function,
        default : ()=>{}
      },
      files : {
        type : Array,
        default : () => {return []}
      },
      getFile : {
        type : Function,
        default : () => {}
      },
      postFile :{
        type : Function,
        default : () => {}
      },
      getFiles : {
        type : Function,
        default : () => {}
      },
      setConfig : {
        type : Function,
        default : () => {}
      },
      defaultConfig : {
        type : Object,
        default : ()=>{return null}
      },
      categories : {
        type : Array,
        default : () => { return []}
      },
      deleteFiles :{
        type : Function,
        default : () => {}
      },
      setCategories : {
        type : Function,
        default : () => {}
      }
    },
    data () { 
      return {
        progress: 0,
        selected : [],
        showProgress : false,
        config : {
          appFolder : 'AppFolder',
          configFile : "settings.json",
          favoritesFile : "favorites.json"
        }
      }
    },
    watch : {
      dialog : function() {
        if(this.dialog) {
          this.progress = 0
        }
      },
      defaultConfig : {
        handler : function(defaultConfig) {
          if(defaultConfig) {
            this.config = {
              appFolder : defaultConfig.appFolder,
              configFile : defaultConfig.configFile,
              favoritesFile : defaultConfig.favoritesFile,
              categories : defaultConfig.categories
            }
          }
          
        },
        immediate : true
      },
      config : {
        handler : function() {
          if(this.config)
            this.setConfig(this.config)
        },
        deep : true,
        immediate : true
      }
    }
  }
</script>
