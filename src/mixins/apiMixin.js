import api from '../axios'
import {getAuthCode} from "../youtube"

export default {
    data: () => ({}),
    methods : {
        getAuthCode,
        getData: function(url, callBack) { 
            api.getData(url)
            .then(response => {
                if(response && callBack)
                    callBack(response.data)
                
            })
            .catch(error => {
                if(error.response.status === 401)
                    this.getAuthCode()
                else if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        getDataByBody : function(url, parameters, callBack) { 
            api.getDataByBody(url, parameters)
            .then(response => {
                if(response && callBack)
                    callBack(response.data)
                
            })
            .catch(error => {
                if(error.response.status === 401)
                    this.getAuthCode()
                else if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        getStream: function(url, parameters, abortController, callBack) {
            api.getStream(url, parameters, abortController)
            .then(response => {
                if(response && callBack)
                    callBack(response.data)                
            })
            .catch(error => {
                if(error.message === 'canceled' && callBack)
                    callBack(null, error.message)
                else if(error.response.status === 401)
                    this.getAuthCode()
                else if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        getFile: function(url, callBack) {
            api.downloadfile(url)
            .then(response => {
                if(response && callBack)
                    callBack(response)
            })
            .catch(error => {
                if(error.response.status === 401)
                    this.getAuthCode()
                else if(callBack)
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
                if(error.response.status === 401)
                    this.getAuthCode()
                else if(callBack)
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
                    if(error.response.status === 401)
                        this.getAuthCode()
                    else if(callBack)
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
                if(error.response.status === 401)
                    this.getAuthCode()
                else if(callBack)
                    callBack(error)
            })
            .finally(() => this.loading = false)
        },
        getYoutbeVideos : function(url, callBack) {
            this.getData(url, callBack)
        }
    }
}