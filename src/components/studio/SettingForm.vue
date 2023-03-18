<template>
<FloatDialog
  :title="settingView" 
  :showDialog="dialog"
  :setShowDialog="setSettingDialog"
>
  <template #list v-if="settingView === 'Setting'">
    <v-list-item-group 
      v-model="selectedItem"
      color="primary"
    >
      <v-list-item  
        v-for="(item, i) in items"
        :key="i"
      >
        <v-list-item-content>
          <v-list-item-title>{{item.text}}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>

      </v-list-item>
    </v-list-item-group>

  </template>
  <template #form v-if="settingView === 'General'">
    <v-icon class="ml-2" @click="resetView">mdi-arrow-left</v-icon>
    <AppConfigDialog
      :files="files"
      :getFile="getFile" 
      :getFiles="getFiles"
      :postFile="postFile"
      :initForm="initForm"
      :setConfig="setConfig"
      :deleteFiles="deleteFiles"
      :defaultConfig="defaultConfig"
      :categories="categories"
      :setCategories="setCategories"
    />

  </template>
  <template #table v-if="settingView === 'Channels'">
    <v-icon class="ml-2" @click="resetView">mdi-arrow-left</v-icon>
    <ChannelSettingDialog 
      :dialog="dialog"
      :config="config"
      :setSettingDialog="setSettingDialog"
      :favoritesChannels="favoritesChannels"
      :setFavoritesChannel="setFavoritesChannel"
    />
  </template>

  <template #buttons>
    <v-btn
      v-if="settingView === 'General'"
      color="primary"
      text
      @click="save"
    >
      Save
    </v-btn>
    <v-btn
      v-if="settingView === 'Channels'"
      color="primary"
      text
      @click="submitFavorites"
    >
      Submit
    </v-btn>
  </template>
</FloatDialog>
</template>
<script>

  import apiMixin from "../../mixins/apiMixin"
  import FloatDialog from "./dialog/FloatDialog.vue"
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
    data () { 
      return {
        files : [],
        selected : [],
        favoritesChannels : [],
        dbFavoritesChannels : [],
        selectedItem : null,
        settingView : 'Setting',
        configFile : "settings.json",
        config : {
          appFolder : 'AppFolder',
          configFile : "settings.json",
          playListFile : "playList.json",
          favoritesFile : "favorites.json",
          categories  : [
            'News',
            'Autos & Vehicles',  
            'Comedy', 
            'Education', 
            'Entertainment',
            'Film & Animation',
            'Gaming',
            'Sports',
            'Travel & Events',
            'Music',
            'People and Blogs'
          ]  
        },
        defaultConfig : null,
        items: [
          { text: 'General', icon: 'mdi-arrow-right' },
          { text: 'Channels', icon: 'mdi-arrow-right' }
        ],
        categories : [
          'News',
          'Autos & Vehicles',  
          'Comedy', 
          'Education', 
          'Entertainment',
          'Film & Animation',
          'Gaming',
          'Sports',
          'Travel & Events',
          'Music',
          'People and Blogs'
        ]
      }
    },
     watch : {
      dialog : {
        handler : function() {
          if(!this.dialog) {
            this.selectedItem = null
            this.settingView = 'Setting'
          }
        },
        immediate : true
      },
      selectedItem : {
        handler : function() {
          if(this.items[this.selectedItem])
            this.settingView = this.items[this.selectedItem].text
        },
        immediate : true
      }
    },
    mounted() {
      this.initForm()
      this.initFavorites()
    },
    mixins : [
      apiMixin
    ],
    methods : {
      resetView : function() {
        this.selectedItem  = null
        this.settingView = 'Setting'
      },
      setConfig : function(config) {
        if(config)
          this.config = config
      },
      setCategories : function(categories) {
        if(categories) {
          this.config.categories = categories
        }
      },
      initForm : function() {
        this.getFile(this.configFile, (config) => {
          const {configFile, favoritesFile , appFolder, categories} = config
          
          if(configFile && favoritesFile && appFolder) {
            this.config.configFile = configFile
            this.config.favoritesFile = favoritesFile 
            this.config.appFolder = appFolder
            this.categories = categories
            this.config.categories = categories
            this.$store.commit("updateConfig", config)
            this.getFiles()
            this.defaultConfig = config
          } else {
            this.$store.commit("updateConfig", config)
          }
        })
      },
      setFavoritesChannel : function(channel) {
        if(channel) {
          this.dbFavoritesChannels = channel
        }
      },
      initFavorites : function() {
        this.getFile(this.config.favoritesFile, (favorites) => {
          if(favorites) {
            this.favoritesChannels = favorites
            this.$store.commit("updateFavoritesChannels", favorites)
          }
        })
      },
      submitFavorites : function() {
        if(this.favoritesChannels) {
          this.postFile(this.config.appFolder, this.config.favoritesFile, this.dbFavoritesChannels, () => {
            this.$store.commit("updateFavoritesChannels", this.dbFavoritesChannels)
          })
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
        const {appFolder, configFile} = this.config
        
        if(appFolder && configFile && this.config) {
          this.postFile(this.config.appFolder, this.config.configFile, this.config, () => {
            this.getFiles()
            this.$store.commit("updateConfig", this.config)
             console.log("save file : ", this.appFolder)
          })
        }
      }
    },
  }
</script>
