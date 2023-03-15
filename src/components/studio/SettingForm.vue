<template>
<FloatDialog
  title="Setting" 
  :showDialog="dialog"
  :setShowDialog="setSettingDialog"
>
  <template #form>
    <AppConfigDialog
      :files="files"
      :getFile="getFile" 
      :getFiles="getFiles"
      :postFile="postFile"
      :setConfig="setConfig"
      :setSelected="setSelected"
    />

    <ChannelSettingDialog 
      :dialog="dialog"
      :channels="channels"
      :setSettingDialog="setSettingDialog"
    />
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
  import AppConfigDialog from "../studio/AppConfigDialog.vue"
  import ChannelSettingDialog from "../studio/ChannelSettingDialog.vue"
  export default {
    name: 'SettingForm',
    components : {
      FloatDialog,
      AppConfigDialog,
      ChannelSettingDialog
    },
    props : {
      dialog : {
        type : Boolean,
        default : () => {return false}
      },
      channels : {
        type : Array,
        default : () => {}
      },
      setSettingDialog : {
        type : Function,
        default : ()=>{}
      },
    },
    watch : {},
    data () { 
      return {
        config : {
          appFolder : 'AppFolder',
          configFile : "settings.json",
          favoritesFile : "favorites.json"
        },
        files : [],
        selected : []
      }
    },
    mixins : [
      apiMixin
    ],
    mounted() {},
    methods : {
      setConfig : function(config) {
        if(config)
          this.config = config
      },
      setSelected : function(selected) {
        if(selected) {
          this.selected = selected
        }
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
        const {appFolder, configFile, } = this.config

        if(appFolder && configFile && this.config) {
          this.postFile(this.appFolder, this.configFile, this.config, ()=>{
            this.getFiles()
            this.$store.commit("updateConfig", this.config)
             console.log("save file : ", this.appFolder)
          })
        }
      }
    },
  }
</script>
