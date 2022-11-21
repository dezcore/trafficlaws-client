import api from '../axios'

export default {
    data: () => ({
    }),
    methods : {
        getData: function(url, callBack) {
            console.log("getData : ", url)
            api.getData(url)
            .then(response => {
                if(response && callBack)
                    callBack(response.data)
            })
            .catch(error => {
                if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        putData : function(url, data, callBack) {
            api.update(url, data)
            .then(response => {
                if(callBack)
                    callBack(response.data)
            })
            .catch(error => {
                if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        postData : function(url, data, callBack) {
            api.create(url, data)
                .then(response => {
                    if(callBack)
                        callBack(response.data)
                })
                .catch(error => {
                    if(callBack)
                        callBack(error)
                })
                .finally(() => this.loading = false)
        },
        deleteData : function(url, callBack) {
            api.delete(url)
            .then(response => {
                if(callBack)
                    callBack(response.data)
            })
            .catch(error => {
                if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        getYoutbeVideos : function(url, callBack) {
            this.getData(url, callBack)
        }
    }
}