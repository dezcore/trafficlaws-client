import api from '../axios'

export default {
    data: () => ({
    }),
    methods : {
        getData: async function(url, callBack) {
            await api.getData(url)
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
        putData : async function(url, data, callBack) {
            await api.update(url, data)
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
        postData : async function(url, data, callBack) {
            await api.create(url, data)
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
        deleteData : async function(url, callBack) {
            await api.delete(url)
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