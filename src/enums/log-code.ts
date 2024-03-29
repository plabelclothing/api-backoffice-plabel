export const enum LogCode {
    /** common codes **/
    GEN_000_ERR = 'GEN_000_ERROR',
    GEN_001_ERR = 'GEN_001_ERROR',
    GEN_002_ERR = 'GEN_002_ERROR',
    GEN_003_ERR = 'GEN_003_ERROR',
    GEN_004_ERR = 'GEN_004_ERROR',
    GEN_005_ERR = 'GEN_005_ERROR',
    DATA_NOT_FOUND = 'DATA_NOT_FOUND',
    DUPLICATE = 'DUPLICATE',
    /** common codes **/

    MYSQL_SERVICE__QUERY_ERR = 'MYSQL__ERROR',
    MYSQL_SERVICE__CONN_ERR = 'MYSQL__ERROR',
    VALIDATION_UTIL__ERR = 'VALIDATION__ERROR',
}

export const enum LogCodeId {
    /** common codes **/
    GEN_000_ERR = 10000000,
    GEN_001_ERR = 10000001,
    GEN_002_ERR = 10000002,
    GEN_003_ERR = 10000003,
    GEN_004_ERR = 10000004,
    GEN_005_ERR = 10000005,
    DATA_NOT_FOUND = 10000011,
    DUPLICATE = 10000012,
    /** common codes **/

    MYSQL_SERVICE__QUERY_ERR = 10000006,
    MYSQL_SERVICE__CONN_ERR = 10000007,
    VALIDATION_UTIL__ERR = 10000008,
}

export const enum StatusHttp {
    FAIL = 'FAIL',
    SUCCESS = 'SUCCESS',
}
