import ExpressCassandra from 'express-cassandra';

const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ['172.17.0.2'],
    localDataCenter: 'datacenter1',
    protocolOptions: { port: 9042 },
    keyspace: 'mykeyspace',
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
