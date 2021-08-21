declare module ApplicationConfig {

    interface ExpressApi {
        bind: string,
        port: number,
    }

    interface Luxon {
        timezone: string;
    }

    interface WinstonConsole {
        level: string;
        handleExceptions: boolean;
        json: boolean;
        colorize: boolean;
    }

    interface WinstonFile {
        level: string;
        handleExceptions: boolean;
        filename: string;
        json: boolean;
        maxsize: number;
        maxFiles: number;
        colorize: boolean;
    }

    interface WinstonSentry {
        level: string;
        dsn: string;
    }

    interface WinstonTransports {
        file: {
            enabled: boolean;
        };
        console: {
            enabled: boolean;
        };
        sentry: {
            enabled: boolean;
        };
    }

    interface Winston {
        console: WinstonConsole;
        file: WinstonFile;
        sentry: WinstonSentry;
        transports: WinstonTransports;
        exitOnError: boolean;
    }

    interface MySqlConnection {
        connectionLimit: number;
        host: string;
        port: number;
        database: string;
        user: string;
        password: string;
        charset: string;
        timezone?: string;
    }

    interface MysqlRead {
        id: string;
        connection: MySqlConnection;
        reconnectPeriod: number;
    }

    interface MysqlWrite {
        id: string;
        connection: MySqlConnection;
        reconnectPeriod: number;
    }

    export interface RootObject {
        application: string;
        applicationKey: string;
        expressApi: ExpressApi;
        luxon: Luxon;
        winston: Winston;
        mysqlRead: MysqlRead;
        mysqlWrite: MysqlWrite;
    }

}
