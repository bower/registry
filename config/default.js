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
    registryEditors: process.env.REGISTRY_EDITORS,

    memcached: {
        servers: ['127.0.0.1:11211'],
        username: null,
        password: null
    }
};
