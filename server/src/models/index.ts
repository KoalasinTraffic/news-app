import ExpressCassandra from 'express-cassandra';

/*
contactPoint: 127.0.0.1 (localhost)
localDataCenter: `docker exec -it cassandra nodetool status`
*/

const cassandraHost = process.env.CASSANDRA_HOST || 'cassandra';

const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: [cassandraHost],
    localDataCenter: 'datacenter1',
    protocolOptions: { port: 9042 },
    keyspace: 'news_app',
    queryOptions: { consistency: ExpressCassandra.consistencies.one },
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1,
    },
    migration: 'safe',
  },
});

export default models;
