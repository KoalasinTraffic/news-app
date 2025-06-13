import expressCassandra from 'express-cassandra';

const models = expressCassandra.createClient({
  clientOptions: {
    contactPoints: ['172.17.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'my_keyspace',
    queryOptions: { consistency: expressCassandra.consistencies.one },
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
