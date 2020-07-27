import {getCalypsoToken, App} from "./app-data";

export const isCalypsoApiEnabled = () => {
    return window.CALYPSO_PROXY_TYPE && (proxyType === CALYPSO_PROXY_TYPE.BUNDLE)
}

export const Calypso = {
    loaded: false,
    connected: false,
    forms: [],
}

window.addEventListener("CalypsoClientConnected", () => {
    Calypso.connected = true
    _loadResourceForms();
})
window.addEventListener("CalypsoClientReady", () => {
    Calypso.loaded = true
    _checkMobiUserAuthorized()
})

export async function calypsoConnect() {
    if (isCalypsoApiEnabled()) {
        if (Calypso.loaded && !Calypso.connected) {
            let _token = await getCalypsoToken()
            $calypsoClient.connect(_token)
        }
    } else {
        _loadResourceForms()
    }
}

const _checkMobiUserAuthorized = () => {
    if (App.user.authorized && !Calypso.connected) {
        calypsoConnect()
    }
}

export const calypsoLogout = () => {
    if (isCalypsoApiEnabled() && Calypso.connected) {
        $calypsoClient.logout()
    }
}

const _loadResourceForms = () => {
    let _url = App.options.calypsoUrl ? App.options.calypsoUrl : window.location.origin

    _clearButtons()

    $.ajax({ url: _url + "/api/resources/forms",
        context: document.body,
        success: (data) => {
            Calypso.forms = data.map((item) => {
                if (item.params)
                    item.params = JSON.parse(item.params);
                return item
            })

            _addButtons()
        },
        error: function () {
            this._forms = []
        },
    });
}

const _addButtonsOnClick = () => {

    function _objId_to_params(objId) {
        return { Action: JSON.stringify({ action: "edit", objId: objId }) };
    }

    $('.js-calypso-button').click(function() {
        let btn = $(this),
            _index = btn[0].dataset.index,
            _formGuid = Calypso.forms[_index].formGuid,
            _params = Calypso.forms[_index].params,
            _objId = Calypso.forms[_index].objId;

        getCalypsoToken()
            .then((token) => {
                if (isCalypsoApiEnabled()) {
                    if (_objId)
                        $calypsoClient.createSimpleForm({ formGuid: _formGuid, objId: _objId })
                    else
                        $calypsoClient.addContext({ formGuid: _formGuid, params: _params });
                } else {
                    var id = btn[0].dataset.id
                    $('#iframe-container').empty()

                    var iframe = document.createElement('iframe');
                    let _str = _objId ? $.param(_objId_to_params(_objId), true): $.param( _params, true )
                    iframe.src = encodeURI(`${App.options.calypsoUrl}?iframe=1&formGuid=${_formGuid}&params=${_str}`);
                    $('#iframe-container').append(iframe)
                    $('#iframe-container').append(iframe)
                }
            })
    })
}

const _clearButtons = () => {
    let _buttonsBlock = $(".buttons-block")
    _buttonsBlock.empty()
}

const _addButtons = () => {
    let _buttonsBlock = $(".buttons-block")

    Calypso.forms.forEach((item, index) => {
        _buttonsBlock.append(`<button class="mobi-button blue js-calypso-button" data-index="${index}">${item.name}</button>`)
    })

    _addButtonsOnClick()
}