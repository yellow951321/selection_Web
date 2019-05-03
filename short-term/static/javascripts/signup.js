window.addEventListener('load', ()=>{
  const signup = document.getElementById('signup')
  const signURL = '/auth/signup'

  signup.addEventListener('submit', (event) => {
    event.preventDefault()
    const account = signup.querySelector('.account2')
    const password = signup.querySelector('.password2')
    console.log(account.value)
    console.log(password.value)

    fetch(signURL, {
      method: 'POST',
      body: JSON.stringify({ 'username': account.value, 'password': password.value, }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        if(true || data === 'OK'){
          window.location.assign('/auth/login')
        }
        return true
      })
  })
})
