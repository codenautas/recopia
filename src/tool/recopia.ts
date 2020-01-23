"use strict";

import {promises as fs} from "fs";
import * as fsExtra from "fs-extra";
import * as Path from "path";

// const FSTATOPT = {bigint:true};

export async function fsstat(path:string){
    // @ts-ignore
    return fs.stat(path);
}

export async function fsutimes<T extends string|number|Date|bigint>(path:string, atime:T, mtime:T){
    return fs.utimes(
        path, 
        // @ts-ignore
        typeof atime == "bigint" ? atime.toString() : atime,
        // @ts-ignore
        typeof mtime == "bigint" ? mtime.toString() : mtime
    );
}

export async function copiar(src:string, dest:string, opts:any){
    var entries = await fs.readdir(src);
    while(entries.length){
        var name = entries.shift()!;
        var srcPath=Path.join(src, name);
        var destPath=Path.join(dest, name);
        var stat = await fsstat(srcPath);
        if(stat.isDirectory()){
            await fsExtra.ensureDir(destPath);
            // TODO: OJO QUE PUEDE EXISTIR AHORA UN ARCHIVO CON ESE NOMBRE
            await copiar(srcPath, destPath, opts)
        }else{
            var srcStat =await fsstat(srcPath);
            var deboCopiar = null;
            try{
                var destStat=await fsstat(destPath);
                deboCopiar = srcStat.mtimeMs != destStat.mtimeMs;
            }catch(err){
                if(err.code=='ENOENT'){
                    deboCopiar = true;
                }else{
                    throw err;
                }
            }
            // console.log('xxxxxxx esta por copiar',deboCopiar,srcPath, destPath, srcStat.mtimeMs, (destStat||{}).mtimeMs);
            if(deboCopiar){
                await fs.copyFile(srcPath, destPath);
                // await fs.utimes(destPath,srcStat.mtime)
            }
        }
    }
}