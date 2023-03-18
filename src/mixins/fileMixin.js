import apiMixin from "./apiMixin"

export default {
    data: () => ({
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