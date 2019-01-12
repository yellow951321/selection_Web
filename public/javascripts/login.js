const login = document.getElementById('verify');
const reqURL = '/log/in';
login.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    const account = login.querySelector( '.account' );
    const password = login.querySelector( '.password' );

    console.log('Line 9');

    fetch(reqURL, {
        method: 'POST',
        body: JSON.stringify({'account': account.value, 'password': password.value}),
        headers: {
            //'Accept': "application/json",
            'Content-Type': "application/json"
        }
    })
    .then( res => res.json() )
    .then( data => {
        //const error = login.querySelector( '.login__error' );
        console.log('Yeeeeeeeee');
        if( data[ 'response' ] === 'ok' )
        {
            console.log('Yeeees');
            //loginClear();
            //error.classList.add( 'login__error--hidden' );
            //window.location = ${ serverSetting.host }/?language=${ currentLanguage };
        }
        /*else
        {
            loginClear();
            login.querySelector( '.login__reset' ).classList.add( 'login__reset--hidden' );
            login.querySelector( '.login__forget' ).classList.remove( 'login__forget--hidden' );
            if( error.classList.contains( 'login__error--hidden' ))
                error.classList.remove( 'login__error--hidden' );
        }*/
        return true
    })
})