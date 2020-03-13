import {handleError} from "./tools"

export const App = {
    options: null,
    user: {},
    fetching: false,
}

export const getOptions = () => {
    $.ajax({
        url: "/api/options",
        context: document.body,
        success: (data) => {
            App.options = Object.assign({}, data)
        },
        error: handleError
    });
}

export const whoAmI = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/api/whoami",
            context: document.body,
            success: (data) => {
                App.user = {
                    authorized: true,
                    user: Object.assign({}, data)
                }

                resolve(data.login)
            },
            error: (jqXHR, exception) => {
                if (jqXHR.status === 401) {
                    reject(new Error("UNAUTHORIZED"))
                    return
                }

                handleError(jqXHR, exception)
            },
        });
    })
}

export const getCalypsoToken = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/api/calypso-token",
            context: document.body,
            success: (data) => {
                resolve (data.token)
            },
            error: function (jqXHR, exception) {
                handleError(jqXHR, exception)
                reject(new Error())
            }
        });
    })
}

export const login = (form) => {
    return new Promise((resolve, reject) => {
        let url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: (data) => {
                resolve(data.login)
            },
            error: function (jqXHR, exception) {
                handleError(jqXHR, exception)
                reject(new Error())
            }
        });
    })
}

export const logout = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/api/logout",
            context: document.body,
            success: function () {
                App.user = {}
                resolve()
            },
            error: function (jqXHR, exception) {
                handleError(jqXHR, exception)
                reject(new Error())
            }
        });
    })
}