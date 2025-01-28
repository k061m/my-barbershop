const { , validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'my-barbershop',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

