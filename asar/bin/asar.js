#!/usr/bin/env node

var packageJSON = require('../package.json')
var splitVersion = function (version) { return version.split('.').map(function (part) { return Number(part) }) }
var requiredNodeVersion = splitVersion(packageJSON.engines.node.slice(2))
var actualNodeVersion = splitVersion(process.versions.node)

if (actualNodeVersion[0] < requiredNodeVersion[0] || (actualNodeVersion[0] === requiredNodeVersion[0] && actualNodeVersion[1] < requiredNodeVersion[1])) {
  console.error('CANNOT RUN WITH NODE ' + process.versions.node)
  console.error('asar requires Node ' + packageJSON.engines.node + '.')
  process.exit(1)
}

// Not consts so that this file can load in Node < 4.0
var asar = require('../lib/asar')
// var program = require('commander')

module.exports.pack = async function (src, dest) {
  options = {
    // unpack: options.unpack,
    // unpackDir: options.unpackDir,
    // ordering: options.ordering,
    // version: options.sv,
    // arch: options.sa,
    // builddir: options.sb,
    // dot: !options.excludeHidden
  }
  try{
    asar.createPackageWithOptions(src, dest, options, function (error) {
      if (error) {
        // console.error(error.stack)
      }
    });
  }
  catch(e){}
}


module.exports.list = async function (archive_path) {
    options = {
      // isPack: options.isPack
    }
    try{
      var files = asar.listPackage(archive, options)
      for (var i in files) {
        yield(files[i]);
      }
    }
    catch(e){}
}

module.exports.extract_single = async function (archive, filename) {
  try{
    require('fs').writeFileSync(require('path').basename(filename),
    asar.extractFile(archive, filename))
  }
  catch(e){}
}

module.exports.extract = async function (archive, dest) {
  try{
    asar.extractAll(archive, dest);
  }
  catch(e){}
}