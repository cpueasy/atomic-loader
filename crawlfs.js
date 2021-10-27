const fs = require("fs");
const path = require("path");

async function* walk(dir) {
    try{
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(dir, d.name);
            if (d.isDirectory()) yield* walk(entry);
            else if (d.isFile()) yield entry;
        }
    }
    catch(e){}
}

async function get_exe(dir){
    var found_exe = [];
    try{
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(d.name);
            if(entry.endsWith('.exe') == true){
                found_exe.push(entry)
            }
        }
        if(found_exe.length != 0 && found_exe !== undefined){
            return found_exe;
        }
    }
    catch(e){}
}

module.exports.electron_exe = (async (asar_apps) => {
    asars = [];
    found_exe = [];
    asar_apps.forEach(app => {
        asars.push(app.split("\\"));
    });
    for(asar of asars){
        for(i=asar.length; i>0; i--){
            a = (asar.join("\\").split("\\", i).join("\\"));
            b = await get_exe(a);
            if(b !== undefined){
                found_exe.push(b[0]);
            }
        }
    }
    let unique = [...new Set(found_exe)]
    return unique;
})

module.exports.asar_apps = (async () => {
    var asar_paths = [];
    try{
        for await (var f of walk(process.env.LOCALAPPDATA)){
            if(f.endsWith('.asar') == true){
                asar_paths.push(f);
            }
        }
        return asar_paths;
    }
    catch(e){}
})