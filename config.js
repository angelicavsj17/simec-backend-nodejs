module.exports = {
    api: {
        port: process.env.PORT || 3000
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret'
    },

    mysql: {
        host: process.env.MYSQL_HOST || 'remotemysql.com',
        port: process.env.MYSQL_PORT || "3306",
        user: process.env.MYSQL_USER || 'QpB1is9GIZ',
        password: process.env.MYSQL_PASS || 'vjgq5LNKsU',
        database: process.env.MYSQL_DB || 'QpB1is9GIZ',
    },

    mysqlService: {
        host: process.env.MYSQL_SRV_HOST || 'localhost',
        port: process.env.MYSQL_SRV_PORT || 3001,
    },
    mariadb: {
        host: process.env.MARIADB_HOST || 'webmedico-db-production-southcentralus.database.windows.net',
        port: process.env.MARIADB_PORT || 1433,
        user: process.env.MARIADB_USER || 'SimecPRODSQL11162017',
        password: process.env.MARIADB_PASS || 'SimSCUSAProd2017',
        database: process.env.MARIADB_DB || 'WebMedico-SQL-db-PRODUCTION-southcentralus',
    },

    mariadbService: {
        host: process.env.MYSQL_SRV_HOST || 'localhost',
        port: process.env.MYSQL_SRV_PORT || 3002,
    },
    azure: {
        blob: {
            azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ||
                `DefaultEndpointsProtocol=https;AccountName=fesimecgroupdiag;AccountKey=lvikf3e+2otgt+H+EgTJ+4VILM8TdQaUVsMkk6G3uqmGg2RItnHx3b3qdyhtcRAoHTkWsfYst+UDK43oGEXT7Q==;EndpointSuffix=core.windows.net`,
            containerName: 'files'
        }
    }
};