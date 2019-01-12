const login = document.getElementById('login');
const signupbutton = document.getElementById('signupbutton');
const signup = document.getElementById('signup');
const backbutton = document.getElementById('back');
const reqURL = '/log/in';
const signURL = '/signup';

signup.style.display = 'none';
//document.getElementById('wrong').style.display = 'none';
document.getElementById('wrong').style.visibility = 'hidden';
document.getElementById('hide').style.visibility = 'hidden';

let textclear = function () {
    let account = document.getElementsByClassName('account');
    let password = document.getElementsByClassName('password');
    account[0]['value'] = '';
    account[1]['value'] = '';
    password[0]['value'] = '';
    password[1]['value'] = '';
}
login.addEventListener('submit', (event) => {
    event.preventDefault();

    const account = login.querySelector('.account');
    const password = login.querySelector('.password');

    
    //console.log(account);
    fetch(reqURL, {
        method: 'POST',
        body: JSON.stringify({ 'account': account.value, 'password': password.value }),
        headers: {
            //'Accept': "application/json",
            'Content-Type': "application/json"
        }
    })
    .then( res => res.text() )
    .then(data => {
        //const error = login.querySelector( '.login__error' );
        //console.log(data);
        if (data === ' OK') {
            console.log('Login success');
            //error.classList.add( 'login__error--hidden' );
            //window.location = 'http://localhost:3000/';
        }
        else
        {
            document.getElementById('wrong').style.visibility = 'visible';
            //document.getElementById('wrong').style.display = 'block';
            /*login.querySelector( '.login__reset' ).classList.add( 'login__reset--hidden' );
            login.querySelector( '.login__forget' ).classList.remove( 'login__forget--hidden' );
            if( error.classList.contains( 'login__error--hidden' ))
                error.classList.remove( 'login__error--hidden' );*/
        }
        return true
    })
})

signup.addEventListener('submit', (event) => {
    event.preventDefault();
    const account = signup.querySelector('.account');
    const password = signup.querySelector('.password');
    console.log(account + password);
    
    fetch(signURL, {
        method: 'POST',
        body: JSON.stringify({ 'account': account.value, 'password': password.value }),
        headers: {
            'Content-Type': "application/json"
        }
    })
    .then(res => res.text())
    .then(data => {
        if(data === "OK"){
            console.log('register success');
        }
        return true;
    })
})

signupbutton.addEventListener('click', (event) => {
    event.preventDefault();
    login.style.display = 'none';
    signup.style.display = 'block';
    console.log('hidden');
})

backbutton.addEventListener('click', (event) => {
    event.preventDefault();
    login.style.display = 'block';
    signup.style.display = 'none';
    textclear();
    document.getElementById('wrong').style.visibility = 'hidden';
    console.log('back');
})