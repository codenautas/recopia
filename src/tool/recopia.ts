"use strict";

import * as fs from "fs-extra";
import * as Path from "path";

export async function copiar(src:string, dest:string, opts:any){
    var entries = await fs.readdir(src);
    while(entries.length){
        var name = entries.shift()!;
        var srcPath=Path.join(src, name);
        var destPath=Path.join(dest, name);
        var stat = await fs.stat(srcPath);
        if(stat.isDirectory()){
            await fs.ensureDir(destPath);
            // TODO: OJO QUE PUEDE EXISTIR AHORA UN ARCHIVO CON ESE NOMBRE
            await copiar(srcPath, destPath, opts)
        }else{
            await fs.copyFile(srcPath, destPath);
        }
    }
}