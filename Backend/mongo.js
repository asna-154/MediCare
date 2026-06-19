const MongoStore = require("connect-mongo");
console.log("MongoStore object:", MongoStore);
console.log("Type of MongoStore:", typeof MongoStore);
console.log("Keys in MongoStore:", Object.keys(MongoStore));
console.log("Is MongoStore a function?", typeof MongoStore === 'function');
console.log("Does MongoStore have create?", 'create' in MongoStore);