<template>
<FloatDialog
  title="Setting" 
  :showDialog="dialog"
  :setShowDialog="setSettingDialog"
>
  <template #form>
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
  <template #buttons>
    <v-btn
      color="primary"
      text
      @click="save"
    >
      Save
    </v-btn>
    <v-btn
      color="primary"
      text
      @click="deleteFiles(0, selected)"
    >
      Delete
    </v-btn>
  </template>
</FloatDialog>
</template>
<script>
  import apiMixin from "../../mixins/apiMixin"
  import FloatDialog from "./FloatDialog.vue"

  export default {
    name: 'SettingForm',
    components : {
      FloatDialog
    },
    props : {
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      setSettingDialog : {
        type : Function,
        default : ()=>{}
      },
    },
    watch : {
      dialog : function() {
        if(this.dialog) {
          this.progress = 0
        }
      }
    },
    data () { 
      return {
        progress: 0,
        files : [],
        selected : [],
        showProgress : false,
        appFolder : 'AppFolder',
        configFile : "settings.json",
        favoritesFile : "favorites.json"
      }
    },
    mixins : [
      apiMixin
    ],
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

      },
      getFile : function(name, callBack) {
        if(name) {
          this.getData(process.env.VUE_APP_API_URL + "/google/drive/file/content/" + name, (response) => {
            if(callBack)
              callBack(response)
          })
        }
      },
      getFiles : function() {
        this.getData(process.env.VUE_APP_API_URL + "/google/drive/files", (response) => {
          if(response)
            this.files = response.files
        })
      },
      postFile : function(folderName, fileName, data, callBack) {
        if(fileName && data) {
          this.postData(process.env.VUE_APP_API_URL  + "/google/drive/", {
            folderName : folderName,
            fileName : fileName,
            data : data
          }, (postRes) => {
            if(callBack)
              callBack(postRes)
          })
        }
      },
      deleteFile : function(file, callBack) {
        if(file) {
          this.deleteData(process.env.VUE_APP_API_URL + "/google/drive/file/" + file.fileId, () => {
            if(callBack)
              callBack()
          })
        }
      },
      deleteFiles : function(index, files) {
        if(files && files[index]) {
           this.deleteFile(files[index], () => {
            this.files = this.files.filter(file => file.fileId !== files[index].fileId)
            this.deleteFiles(index + 1 , files)
           })
        } else if(index < files.length) {
          this.deleteFiles(index + 1, files)
        }
      },
      save : function() {
        const config = {
          'AppFolder' : this.appFolder,
          'favorites' : this.favoritesFile,
          'configFile' : this.configFile
        }
        
        if(this.appFolder && this.configFile && config) {
          this.postFile(this.appFolder, this.configFile, config, ()=>{
            this.getFiles()
            this.$store.commit("updateConfig", config)
             console.log("save file : ", this.appFolder)
          })
        }
      }
    },
  }
</script>
