$(document).ready(() => {

    let User = null

    $.ajax({ url: "/api/whoami",
        context: document.body,
        success: function(data)
        {
            User = Object.assign({}, data)
            $('.user-block__user-name').text(User.login)
            $('.main-form').removeClass("_hidden")
            $('.login-form').addClass("_hidden")
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 401) {
                $('.user-block__user-name').text("")
                $('.main-form').addClass("_hidden")
                $('.login-form').removeClass("_hidden")
            }
        },
    });


    $('#login').submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function(data)
            {
                User = Object.assign({}, data)
                $('.user-block__user-name').text(User.login)
                $('.main-form').removeClass("_hidden")
                $('.login-form').addClass("_hidden")
            },
            error: function (jqXHR, exception) {
                _handleError(jqXHR, exception)
                $('.user-block__user-name').text("")
            }
        });
    })

    $('.js-author-button').click(function(e){
        var btn = $(this)
        var id = btn[0].dataset.id

        $.ajax({ url: "/api/calypso-token",
            context: document.body,
            success: function(data){
                $('#iframe-container').empty()

                var iframe = document.createElement('iframe');
                iframe.src = encodeURI(`${data.calypsoUrl}?data_id=${id}&token=${data.token}`);
                $('#iframe-container').append(iframe)
            },
            error: _handleError,
        });
    })

    const _handleError = (jqXHR, exception) => {
        let msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status === 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status === 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        alert(jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : msg);
    }

    window.changeUser = () => {
        $.ajax({ url: "/api/logout",
            context: document.body,
            success: function()
            {
                User = null
                $('.user-block__user-name').text(null)
                $('#iframe-container').empty()
                $('.main-form').addClass("_hidden")
                $('.login-form').removeClass("_hidden")
            },
            error: _handleError
        });
    }

});
