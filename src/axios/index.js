import axios from "axios"

axios.interceptors.request.use(async config => {
    let access_token
    const tokensObj =  window.App.$store.state.trafficlawstore.tokens

    if(tokensObj) {
        access_token = tokensObj.tokens.access_token
        if(config.url.includes('trafficlaws')) {
            config.headers.tokens = JSON.stringify(tokensObj)
            config.headers.accept = "application/json"
        } else if(access_token) {
            delete config.headers.tokens
            delete config.headers.accept
            config.headers.Authorization = `Bearer ${access_token}`
        }
    }

    return config
})

export default {
    create : (url, data) => {
        return axios.post(url, data)
    },
    getData : (url) => {
        return axios.get(url)
    },
    getDataByBody : (url, parameters) => {
        return axios.get(url, { params : parameters})
    },
    getStream : function(url, parameters, abortController) {
        const {yUrl, start, end, videoId,format} = parameters

        return (axios.get(url, {
            signal: abortController.signal,
            params : {
                start,
                end,
                yUrl,
                format,
                videoId
            },
            responseType: 'blob',
            transformResponse: [function (data) {
                return data
            }]
        }))
    },
    exportFile : (data) => {
        let downloadUrl, link

        if(data) {
            downloadUrl = window.URL.createObjectURL(new Blob([data]));
            link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'file.mp4'); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    },
    downloadfile : (url) => {
        return (axios.get(url, {
            responseType: 'blob',
            transformResponse: [function (data, headers) {
                //JSON.parse(await data.text());
                console.log("getData : ", data, ", ", headers)
                //const type = headers['content-type']
                
                return data
            }]
        }))
    },
    update : (url, data) => {
        return axios.put(url, data)
    },
    delete : (url) => {
        return axios.delete(url)
    }
}