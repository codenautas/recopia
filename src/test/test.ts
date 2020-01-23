"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */
/*eslint-env node*/
/* global describe */
/* global it */

import * as fs from 'fs-extra';
import * as discrepances from "discrepances";
import { copiar } from "../..";
// import * as Path from 'path';

async function compareFiles(expectedFileName:string, obtainedFileName:string){
    var expected = await fs.readFile(expectedFileName,'utf8');
    var obtained = await fs.readFile(obtainedFileName,'utf8');
    discrepances.showAndThrow(obtained, expected);
}

// var PATH='src/test/fixtures';

describe('recopia', function(){
    it('copies archivo3.txt to the-local', async function(){
        await fs.remove(`work/the-local`);
        await fs.ensureDir(`work/the-local`); 
        await copiar(`src/test/fixtures/inicial-local`, `work/the-local`, {});
        await compareFiles(`src/test/fixtures/inicial-local/archivo3.txt`,`work/the-local/archivo3.txt`);
    });
});

