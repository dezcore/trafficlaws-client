import apiMixin from "./apiMixin"
let fileDownload = require('js-file-download');

export default {
    data: () => ({
        stopAll : false,
        waitingList : [],
        stopDownload : false,
        abortController : null,
        settingsFile : 'settings.json'
    }),
    mixins : [
        apiMixin,        
    ],
    methods : {
        getFile : function(name, callBack) {
            if(name) {
              this.getData(process.env.VUE_APP_API_URL + "/google/drive/file/content/" + name, (response) => {
                if(callBack)
                  callBack(response)
              })
            }
        }, 
        getFiles : function(callBack) {
            this.getData(process.env.VUE_APP_API_URL + "/google/drive/files", (response) => {
              if(callBack)
                callBack(response)
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
        downloadFile : function(parameters, abortController, callBack) {
          const {title, format} = parameters

          if(parameters) {
            this.getStream(process.env.VUE_APP_API_URL + "/google/youtube/download", parameters, abortController, (data) => {
              console.log("downloadFile callBack : ", this.stopAll)              
              if(data && !this.stopAll /*&& !this.stopDownload*/)
                fileDownload(data, title + "." + format);

              if(callBack)
                callBack()
            })
          }
        },
        deleteFileByName : function(fileName, callBack) {
          if(fileName) {
            this.deleteData(process.env.VUE_APP_API_URL + "/google/drive/folder/" + fileName, () => {
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
        }
    }
}