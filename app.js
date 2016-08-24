var os = require("os");
var _ = require('underscore');

old = _.map(os.cpus(),function(cpu){ return cpu.times});

var interval = 1000;
function getTotal(cpus){
	var total = 0.0;
	var tidle = 0.0;
	_.each(cpus,function(item,cpuKey){
		process.stdout.write('\033c');
		_.each(_.keys(item),function(timeKey){
			total+=parseFloat(item[timeKey]);
			if(timeKey=='idle')
				tidle+=parseFloat(item[timeKey]);
		});
	});
	return {'total':total,'idle':tidle};
};

var cpuInterval = setInterval(function(){
	var current = _.map(os.cpus(),function(cpu){ return cpu.times;});
	var oinfo = getTotal(old);
	var cinfo = getTotal(current);
	var idle = cinfo['idle'] - oinfo['idle'];
	var total = cinfo['total'] - oinfo['total'];
	var perc = 100 - ((idle*100) / total);
	perc = perc.toFixed(2);
	if(perc<0)
		perc = -perc;
	console.log('cpu usage : '+(perc)+'%');
	console.log('cpu idle : '+(100-perc).toFixed(2)+'%');
	var fm = os.freemem();
	var tm = os.totalmem();
	var musage = (parseFloat(tm)-parseFloat(fm))*100 / parseFloat(tm);
	musage = musage.toFixed(2);
	console.log('memory usage : '+musage+'%');
	console.log('freemem : '+fm);
	console.log('totalmem : '+tm);
	old = current;
},interval);