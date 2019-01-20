window.addEventListener('load', ()=>{
  const login = document.getElementById('login')
  const reqURL = '/auth/login'

  login.addEventListener('submit', (event) => {
    event.preventDefault()

    const account = login.querySelector('.account')
    const password = login.querySelector('.password')

    fetch(reqURL, {
      method: 'POST',
      body: JSON.stringify({ 'username': account.value, 'password': password.value, }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        //const error = login.querySelector( '.login__error' );
        console.log(data)
        //temporarily comment the fetchsession()
        //let sessionId = fetchSession()
        if (data) {
          console.log('Login success')
          //error.classList.add( 'login__error--hidden' );
          window.location = 'http://localhost:3000/man' + `/${data}`
        }
        else
        {
          document.getElementById('wrong').style.visibility = 'visible'
        }
        return true
      })
  })
})
