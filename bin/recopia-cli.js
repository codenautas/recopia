#!/usr/bin/env node

"use strict";

var copiar = require('..').copiar;
var params = require('commander');

params
    .version(require('../package').version)
    .name('recopia')
    .usage('--desde <ruta_origen> --hasta <ruta_destino>')
    .requiredOption('-d, --desde <ruta_origen>', 'carpeta donde están los archivos que ses desean copiar')
    .requiredOption('-h, --hasta <ruta_destino>', 'carpeta donde se guardará la copia')
    .option('-v, --verbose', 'informe detallado de avance')
    .parse(process.argv);

copiar(params.desde, params.hasta, params);