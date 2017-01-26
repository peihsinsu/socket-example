var stat = require('./stat');
var log = require('nodeutil').simplelog;
var cfg = {
		host: process.env.COUCHDB || 'ts-db' ,
    cache: true,
    raw: false,
    forceSave: true,
		auth: {
		  username: 'admin', 
		  password: '1234qwer'
		}
  }
var cradle = require('cradle');
var conn = new(cradle.Connection)(cfg);
var sockets = 0;
exports.setSockets = function(i){
	sockets = i;
};

/** 
 * Run couchdb:
 * docker run -d -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=1234qwer \
 *   --restart=always \
 *   -v `pwd`:/usr/local/var/lib/couchdb \
 *   -p 5984:5984 \
 *   --name couchdb couchdb
 */
function initdb(dbname) {
	log.info('initialize %s db', dbname);
	var db = conn.database(dbname);
	db.exists(function (err, exists) {
		if (err) {
			log.error('error', err);
		} else if (exists) {
			log.info('database: %s is exist...', dbname);
		} else {
			log.info('database: %s does not exists... start to create...', dbname);
			db.create();
			/* populate design documents */
			/*
			if(cfg.syncViews[dbname]) {
				var _cfg = cfg.syncViews[dbname];
				log.info('Will create view[%s] for db[%s]', _cfg.view, _cfg.db);
				loader.createView(_cfg.db, _cfg.view, _cfg.file);
			}
			*/
		}
	});
	return db;
}

var db = initdb('healthcheck');

setInterval(function(){
	stat.healthcheck(function(err, data){
		if(err) log.error(err);
		data['sockets'] = sockets;
		log.info('[%s] %s %s %s %s', new Date(), data.hostname, data.cpu_used, data.mem_used, sockets);
		db.save(data.hostname, data, function(err, result) {
			if(err) log.error('Save data error:', err);
		});
	});
}, 3000);
