module.exports = {
    "development": {
        "username": process.env.DB_USER || "root",
        "password": process.env.DB_PASSWORD || "root",
        "database": "ClubeWinx",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        },
        "logging": false
    },
    "test": {
        "username": process.env.DB_USER || "test",
        "password": process.env.DB_PASSWORD || "test",
        "database": "ClubeWinx_test",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        },
        "logging": false
        }
}