var table = []

var findBySId = (sId)=>{
  return table.find((node)=>{
    return node.sessionId = sId
  })
}


table.__proto__.findBySId = findBySId

module.exports = table