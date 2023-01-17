import axios from "axios"

axios.interceptors.request.use(async config => {
    let access_token
    const tokensObj =  window.App.$store.state.trafficlawstore.tokens

    if(tokensObj) {
        access_token = tokensObj.tokens.access_token
        config.headers.common['Authorization'] = `Bearer ${access_token}`
        console.log("tokens : ", access_token)
        config.headers.common['Tokens'] = JSON.stringify(tokensObj)
        config.headers.common['Accept'] = "application/json"
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
    exportFile : (data) => {
        let downloadUrl, link

        if(data) {
            downloadUrl = window.URL.createObjectURL(new Blob([data]));
            link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'file.zip'); //any other extension
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
        console.log("url : ", url)
        return axios.delete(url)
    }
}