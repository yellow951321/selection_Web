(window.onload = ()=>{
  const rect = document.querySelectorAll('rect')

  rect.forEach((node)=>{
    node.addEventListener('click', ()=>{
      console.log(window.location)
      // window.location.assign(windoe.location)
    })
  })

})()



