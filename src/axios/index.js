//import Vue from 'vue'
import axios from "axios"


axios.interceptors.request.use(async config => {
    config.headers.common['Accept'] = "application/json"
    /*const token = await updateToken()
    if(token) {
        //config.headers.common['Authorization'] = `Bearer ${token}`
    }  */
    return config
})


export default {
    create : (url, data) => {
        //const instance = Vue.$keycloak.token ? axios : axiosInstance
        console.log("url : ", url, ", ", data)
        return axios.post(url, data)
    },
    getData : (url) => {
        return (axios.get(url, {
            responseType: url.includes('format') ? 'blob' : 'application/json',
            transformResponse: [function (data, headers) {
                const type = headers['content-type']
                return type === "application/json" ? JSON.parse(data) : {type : type, data : data}
            }]
        }))
    },
    update : (url, data) => {
        return axios.put(url, data)
    },
    delete : (url) => {
        return axios.delete( url)
    }
}