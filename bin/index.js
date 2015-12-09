#!/usr/bin/env node

var server = require('../lib/server.js'),
    client = require('../lib/client');

var path = require('path');
var fs = require('fs');

/**
 * get version
 * @return {String} []
 */
function getVersion(){
  var filepath = path.resolve(__dirname, '../package.json');
  var version = JSON.parse(fs.readFileSync(filepath)).version;
  return version;
}

function displayVersion(){
  var version = getVersion();
  console.log('\npangolin v' + version + '\n');  
}

var program = require('commander');

program
  .usage('[command] <options ...>')
  .option('-v, --version', 'output the version number', function(){
    displayVersion();
  })
  .option('-V', 'output the version number', function(){
    displayVersion();
  });

program
  .command('server')
  .description('start pangolin server')
  .option('-p, --port <port>', 'port of the tcp connection', parseInt)
  .option('-c, --connections <count>', 'max number of http connections', parseInt)  
  .action(function(){
    server({
      port: (0|this.port) || 10000,
      httpConnects: (0|this.connections) || 99
    });
  });

program
  .command('client')
  .description('start pangolin client')
  .option('-r, --remote <addr:port>', 'the ip address of remote tcp server')
  .option('-l, --local <port>', 'port of the local http server')
  .option('-q, --queit', 'ignore access logs')
  .action(function(){
    var remoteHost = ['127.0.0.1', 10000];

    if(this.remote){
      remoteHost = this.remote.split(':');
    }

    client({
      remoteHost : remoteHost[0] || '127.0.0.1',
      remotePort :  remoteHost[1] || 10000,
      localPort: this.local || 80,
      showAccessLog: !this.queit
    });    
  });

var args = process.argv;
if(args.length <= 2){
  args[2] = '-h';
}

program.parse(args);  
