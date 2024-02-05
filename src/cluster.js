require('colors');
require('dotenv').config();
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
	const numCPUs = os.cpus().length;
	const shardCount = numCPUs;

	console.log(`[CLUSTER] Número de núcleos da CPU: ${numCPUs}`.yellow);
	console.log(`[CLUSTER] Número de shards: ${shardCount}`.yellow);

	for (let i = 0; i < shardCount; i++) {
		let env = { SHARD_ID: i, SHARD_COUNT: shardCount },
			newCluster = cluster.fork(env);
		newCluster.process.env = env;
	}

	cluster.on('fork', (worker) => {
		console.log(`[CLUSTER] Worker ${worker.id} criado para a shard ${worker.process.env.SHARD_ID}`.yellow);
	});

	cluster.on('exit', (worker, code, signal) => {
		console.log(`[CLUSTER] Worker ${worker.id} encerrado com código ${code} e sinal ${signal}`.yellow);
		let env = worker.process.env;
		let newCluster = cluster.fork(env);
		newCluster.process.env = env;
	});
}
else {
	const shardId = parseInt(process.env.SHARD_ID);
	const shardCount = parseInt(process.env.SHARD_COUNT);
	require('./index.js')(shardId, shardCount);
}
