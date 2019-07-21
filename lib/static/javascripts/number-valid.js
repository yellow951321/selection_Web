export default (params)=>{
  params.map(param => {
    if(Number.isNaN(param)){
      let err = new Error('validation failed') 
      err.status = 400
      throw err
    }
  })
}