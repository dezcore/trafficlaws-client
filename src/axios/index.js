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