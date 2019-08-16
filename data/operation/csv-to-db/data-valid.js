import {map} from 'projectRoot/lib/static/javascripts/mapping/label.js'



export default (content={}) => {
  try{

    let aspectMap = ['B','C','D','E','F','G','H']
    let {
      aspect = null,
      keypoint = null,
      method = null
    } = content || {}
    aspect = aspectMap.indexOf(aspect)
    if(aspect == - 1)
      throw new Error('There are some problem in check data')
    if( aspect == 5 || aspect == 6 ){
      return true
    }
    keypoint = Number(keypoint) - 1
    method = Number(method) - 1


    const result = (() => {
      if(map[aspect]){
        if(map[aspect].keypoint[keypoint]){
          if(map[aspect].keypoint[keypoint].method[method]){
            return map[aspect].keypoint[keypoint].method[method]
          }else {
            return null
          }
        }else{
          return null
        }
      }else{
        return null
      }
    })()

    if(result !== null ){
      return true
    }else {
      return false
    }
  }catch(err){
    console.log(err + ' error occurred in data-valid.js')
  }
}
