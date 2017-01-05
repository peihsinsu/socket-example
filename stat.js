var exec = require('child_process').exec;
var async = require('async');
var os = require("os");
var diskspace = require('diskspace');
var _ = require('underscore');

function check(cb){
	exec('docker ps --format "{{.ID}},{{.Command}},{{.Image}},{{.CreatedAt}},{{.RunningFor}},{{.Ports}},{{.Status}},{{.Size}},{{.Names}}"', cb);
}

function format(str) {
  var out = []
  var strarr = str.split('\n');
  for(var i = 0 ; i < strarr.length ; i++) {
    var linearr = strarr[i].split(',');

    //console.log('docker ps line fields:', linearr.length);
    //console.log('linearr: ', linearr);
    if(linearr.length == 9) {
      out.push({
        containerId: linearr[0],
        command: linearr[1],
        image: linearr[2],
        createAt: linearr[3],
        created: linearr[4],
        ports: linearr[5],
        status: linearr[6],
        size: linearr[7],
        names: linearr[8]
      });
    }
  }

  return out;
}

exports.summ = summ;
function summ(cb) {
  async.waterfall([
      function(callback) {
        check(function(err, stdo, stde){
          if(err) {
            console.log('[Error] docker ps error:', err);
            callback(err, stde);
          }
          callback(null, {
            //proc_cnt: parseInt(stdo)
            process: format(stdo)
          });
        });
      },
      function(result, callback) {
        result['hostname'] = os.hostname();
        result['mem_used'] = (os.totalmem() - os.freemem()) / os.totalmem() ;
        result['cpu_used'] = cpuAverage();
        result['arch'] = os.cpus()[0]['model'];
        result['cpu_arch'] = os.arch();
				result['ip_detail'] = filterNwInterfaces(os.networkInterfaces())
				result['ips'] = formatIp(result['ip_detail']);
        callback(null, result);
      },
      function(result, callback) {
        diskspace.check('/', function (err, total, free, status) {
          result['rootdisk'] = free/total;
          callback(null, result);
        });
      }
  ], cb);
}

exports.healthcheck = healthcheck;
function healthcheck(cb) {
  async.waterfall([
      function(callback) {
        var result = {};
        result['hostname'] = os.hostname();
        result['mem_used'] = (os.totalmem() - os.freemem()) / os.totalmem() ;
        result['cpu_used'] = cpuAverage();
				result['arch'] = os.cpus()[0]['model'];
        result['cpu_arch'] = os.arch();
				result['ip_detail'] = filterNwInterfaces(os.networkInterfaces())
				result['ips'] = formatIp(result['ip_detail']);
        callback(null, result);
      },
      function(result, callback) {
				diskspace.check('/', function (err, total, free, status) {
					result['rootdisk'] = free/total;
					callback(null, result);
				});
      }
  ], cb);
}

function filterNwInterfaces(obj) {
  var keys = Object.keys(obj);
	for(var i = 0 ; i < keys.length ; i++){
    var key = keys[i];
		if(key.indexOf('docker') == 0 || key.indexOf('veth') == 0 || key.indexOf('lo') == 0) {
			delete obj[key]
		}
	}
	return obj;
}

function formatIp(nws) {
	var out = _.map(_.values(nws), function(v) {
		for(var i = 0 ; i < v.length ; i++) {
			if(v[i] && v[i]['address'])
				return v[i]['address'];
		}
	});
  return out;
}

//Create function to get CPU information
function cpuAverage() {
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
  for(var i = 0, len = cpus.length; i < len; i++) {
    var cpu = cpus[i];
    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }     
    totalIdle += cpu.times.idle;
  }
  return 1 - (totalIdle / totalTick) ;
  //return 1- ( (totalIdle / cpus.length) / (totalTick / cpus.length) );
}



