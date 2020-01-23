"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */
/*eslint-env node*/
/* global describe */
/* global it */

import * as fs from 'fs-extra';
import * as discrepances from "discrepances";
import { copiar, fsstat, fsutimes } from "../..";
// import * as Path from 'path';

async function compareFiles(expectedFileName:string, obtainedFileName:string){
    var expected = await fs.readFile(expectedFileName,'utf8');
    var obtained = await fs.readFile(obtainedFileName,'utf8');
    discrepances.showAndThrow(obtained, expected);
}

async function compareFilesInfo(expectedFileName:string, obtainedFileName:string){
    var expected = await fsstat(expectedFileName);
    var obtained = await fsstat(obtainedFileName);
    discrepances.showAndThrow(obtained.mtime, expected.mtime);
}

// var PATH='src/test/fixtures';

describe('recopia', function(){
    it('copies archivo3.txt to the-local', async function(){
        await fs.remove(`work/the-local`);
        await fs.ensureDir(`work/the-local`); 
        await copiar(`src/test/fixtures/inicial-local`, `work/the-local`, {});
        await compareFiles(`src/test/fixtures/inicial-local/archivo3.txt`,`work/the-local/archivo3.txt`);
        await compareFilesInfo(`src/test/fixtures/inicial-local/archivo3.txt`,`work/the-local/archivo3.txt`);
    });
    it('copies subarchivo1.txt from servidor to the-local', async function(){
        var statArchivo1 = await fsstat(`src/test/fixtures/inicial-local/archivo1.txt`);
        await fsutimes(`work/the-local/archivo1.txt`,statArchivo1.atime,statArchivo1.mtime);
        await fsutimes(`src/test/fixtures/inicial-servidor/archivo1.txt`,statArchivo1.atime,statArchivo1.mtime);
        await fsutimes(`work/the-local/archivo4.txt`,statArchivo1.atime,statArchivo1.mtime);
        await fsutimes(`src/test/fixtures/inicial-servidor/archivo4.txt`,statArchivo1.atime,statArchivo1.mtime);
        await copiar(`src/test/fixtures/inicial-servidor`, `work/the-local`, {});
        await compareFiles(`src/test/fixtures/inicial-servidor/subcarpeta/sub-archivo1.txt`,`work/the-local/subcarpeta/sub-archivo1.txt`);
        await compareFilesInfo(`src/test/fixtures/inicial-servidor/subcarpeta/sub-archivo1.txt`,`work/the-local/subcarpeta/sub-archivo1.txt`);
    });
    it('skips when is the same datetime', async function(){
        var content = await fs.readFile(`work/the-local/archivo1.txt`, 'utf8');
        discrepances.showAndThrow(content, 'otra cosa!');
    });
    it('does not skips when is the same datetime but different sizes', async function(){
        var content = await fs.readFile(`work/the-local/archivo4.txt`, 'utf8');
        discrepances.showAndThrow(content, 'contenido4');
    });
});

