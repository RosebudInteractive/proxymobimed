$(document).ready(() => {

    $.ajax({ url: "/api/whoami",
        context: document.body,
        success: function(){
            $('.main-form').removeClass("_hidden")
            $('.login-form').addClass("_hidden")
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 401) {
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
                alert(data); // show response from the php script.
                $('.main-form').removeClass("_hidden")
                $('.login-form').addClass("_hidden")
            },
            error: _handleError,
        });
    })

    $('.toolbar__button').click(function(e){
        var btn = $(this)
        var id = btn[0].dataset.id

        $.ajax({ url: "/api/calypso-token",
            context: document.body,
            success: function(data){
                $('#iframe-container').empty()

                var iframe = document.createElement('iframe');
                iframe.src = encodeURI(`http://127.0.0.1:3333?data_id=${id}&token=${data.token}`);
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

});
