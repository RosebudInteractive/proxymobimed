import {getOptions, login, logout, whoAmI} from "./app-data";
import {calypsoConnect, calypsoLogout} from "./calypso-data";

getOptions()

$(document).ready(() => {
    whoAmI()
        .then((name) => {
            $('.user-block__user-name').text(name)
            $('.main-form').removeClass("_hidden")
            $('.login-form').addClass("_hidden")

            calypsoConnect()
        })
        .catch((e) => {
            if (e.message === "UNAUTHORIZED") {
                $('.user-block__user-name').text("")
                $('.main-form').addClass("_hidden")
                $('.login-form').removeClass("_hidden")
            }
        })


    $('#login').submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        login($(this))
            .then((name) => {
                $('.user-block__user-name').text(name)
                $('.main-form').removeClass("_hidden")
                $('.login-form').addClass("_hidden")

                calypsoConnect()
            })
            .catch(() => {
                $('.user-block__user-name').text("")
            })
    })

    window.changeUser = () => {
        logout()
            .then(() => {
                calypsoLogout()

                $('.user-block__user-name').text(null)
                $('#iframe-container').empty()
                $('.main-form').addClass("_hidden")
                $('.login-form').removeClass("_hidden")
            })
    }

});