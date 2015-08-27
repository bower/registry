module.exports = {
    port: process.env.PORT,

    skipValidation: false,
    skipNormalization: false,

    database: {
        url: process.env.DATABASE_URL,
        poolSize: 6,
        ssl: false
    },

    // optional: github team id of registry editors
    registryEditorsID: process.env.REGISTRY_EDITORS_ID,

    memcached: {
        servers: ['127.0.0.1:11211'],
        username: null,
        password: null
    }
};
