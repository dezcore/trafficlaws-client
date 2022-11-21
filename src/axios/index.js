//import Vue from 'vue'
import axios from "axios"


axios.interceptors.request.use(async config => {
    const tokens =  window.App.$store.state.trafficlawstore.tokens

    if(tokens) {
        //config.headers.common['Authorization'] = `Bearer ${token}`
        config.headers.common['Tokens'] = JSON.stringify(tokens)
        config.headers.common['Accept'] = "application/json"
    }

    return config
})

export default {
    create : (url, data) => {
        //const instance = Vue.$keycloak.token ? axios : axiosInstance
        return axios.post(url, data)
    },
    getData : (url) => {
        console.log("url : ", url)
        return axios.get(url)  /*(axios.get(url, {
            responseType: url.includes('format') ? 'blob' : 'application/json',
            transformResponse: [function (data, headers) {
                console.log("getData : ", data, ", ", headers)
                const type = headers['content-type']
                return type === "application/json" ? JSON.parse(data) : {type : type, data : data}
            }]
        }))*/
    },
    update : (url, data) => {
        return axios.put(url, data)
    },
    delete : (url) => {
        return axios.delete( url)
    }
}