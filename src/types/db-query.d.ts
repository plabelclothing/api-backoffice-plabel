export declare module DbQuery {
    export interface GetUserSignIn {
        user_backoffice__uuid: string,
        user_backoffice__email: string,
    }

    export interface CheckExistUser {
        user_backoffice__uuid: string,
    }

    export interface GetUserDataByUuid {
        user_backoffice__email: string,
    }

    export interface GetOrdersByCondition {
        user_order__external_id: string,
        user_order__uuid: string,
        transaction__amount: number,
        dict_currency__iso4217: string,
        user_order__order_status: string,
        user_order__status: string,
        user_order__created: number | string,
        user_order__modified: number | string,
    }

    export interface GetOrderByUuid {
        user_order__external_id: string,
        user_order__uuid: string,
        user_order__order_status: string,
        user_order__status: string,
        user_order__additional_information: string,
        user_order__address: string,
        transaction__amount: number,
        dict_currency__iso4217: string,
        user__email: string,
        products__uuid: string,
        list_product__name: string,
        dict_color__name: string,
        dict_size__name: string,
        user_cart_items__amount: number,
        dict_currency_user_cart__iso4217: string,
        products__count: number,
    }
}
