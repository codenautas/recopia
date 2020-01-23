#!/usr/bin/env node

"use strict";

var copiar = require('..').copiar;
var params = require('commander');

var main = async function(){
    try{
        params
            .version(require('../package').version)
            .name('recopia')
            .usage('--desde <ruta_origen> --hasta <ruta_destino>')
            .requiredOption('-d, --desde <ruta_origen>', 'carpeta donde están los archivos que ses desean copiar')
            .requiredOption('-h, --hasta <ruta_destino>', 'carpeta donde se guardará la copia')
            .option('-v, --verbose', 'informe detallado de avance')
            .option('-q, --quiet', 'sin salida por pantalla (salvo errores)')
            .parse(process.argv);
        if(!params.quiet){
            console.log('recopia',params.desde, params.hasta);
        }
        await copiar(params.desde, params.hasta, params);
        if(opts.verbose){
            console.log('fin copia');
        }
    }catch(err){
        if(opts.verbose){
            console.log('ERROR');
        }
        console.log(err);
    }
}

main();