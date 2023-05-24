const elasticClient = require("./elastic-client");

const createIndex = async (indexName) => {
  await elasticClient.indices.create({ 
    index: indexName,
    mappings: {
      properties: {
        billNo: { type: 'integer' },
        country: { type: 'text' },
        itemName: { type: 'text' },
        date: { type: 'date' },
        price: { type: 'integer' },
        quantity: { type: 'integer' },
      }
    }
  });
  console.log("Index \"" + indexName + "\" created");
};

createIndex("commands");