import fs from 'fs'

const encodage = 'utf8'
const folderPath = './../data/' 

function serializeObj(obj, file, callBack) {
    const json = JSON.stringify(obj)
    fs.writeFileSync(file, json)
    console.log("json : ", json, ", ", file, fs)
    fs.writeFile(folderPath + file, json, encodage, callBack)
}

function deSerialize(file) {
    let obj

    fs.readFile(folderPath + file, encodage, (err, data, callBack) => {
        if (err){
            console.log(err)
        } else {
        obj = JSON.parse(data)

        if(callBack)
            callBack(obj)
    }})
}

export {
    serializeObj,
    deSerialize
}