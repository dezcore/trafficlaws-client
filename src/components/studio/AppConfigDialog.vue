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
            v-model="appFolder"
            label="App folder : "
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="configFile"
            label="Configuration file : "
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="favoritesFile"
            label="Favorites file : "
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="selected"
            :items="files"
            name="name"
            item-text="name"
            item-value="name"
            attach
            chips
            label="Files name : "
            multiple
            return-object
          ></v-select>
        </v-col>
      </v-row>
    </v-form>
  </v-card-text>
</div>
</template>
<script>

  export default {
    name: 'AppConfigDialog',
    props : {
      files : {
        type : Function,
        default : () => {}
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
      setSelected : {
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
        },
        appFolder : 'AppFolder',
        configFile : "settings.json",
        favoritesFile : "favorites.json"
      }
    },
    watch : {
      dialog : function() {
        if(this.dialog) {
          this.progress = 0
        }
      },
      selected : function() {
        if(this.selected) {
          this.setSelected(this.selected)
        }
      },
      appFolder : function(appFolder) {
        if(appFolder) {
          this.config.appFolder = appFolder 
          this.setConfig(this.config)
        }  
      },
      favorites : function(favorites) {
        if(favorites) {
          this.config.favorites = favorites
          this.setConfig(this.config)
        }
      },
      configFile : function(configFile) {
        if(configFile) {
          this.config.configFile = configFile
          this.setConfig(this.config)
        }
      }
    },
    mounted() {
      this.initForm()
    },
    methods : {
      initForm : function() {
        this.getFile(this.configFile, (config) => {
          const {configFile, favorites, AppFolder} = config
          if(configFile && favorites && AppFolder) {
            this.configFile = configFile
            this.favoritesFile = favorites
            this.appFolder = AppFolder
            this.$store.commit("updateConfig", config)
            this.getFiles()
          }
        })

      }
    },
  }
</script>
