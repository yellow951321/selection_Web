var data = {
  "教學": {
    "強化教學品質": {
      "推廣創新教學模式": {
        self: 2,
        overview: 20,
      }
      ,
      "訂定核心能力，規劃課程地圖": {
        self: 5,
        overview: 12
      },
      "強化課程內容": {
        self: 4,
        overview: 15
      }
    },
    "跨領域學習": {
      "規劃跨領域學位（分）學程": {
        self: 5,
        overview: 13
      },
      "鼓勵輔系、雙主修": {
        self: 3,
        overview: 17
      },
      "跨領域教學": {
        self: 3,
        overview: 12
      }
    }
  },
  "研究":{
    "測試1":{
      "子測試1-1" : {
        self: 12,
        overview: 12
      },
      "子測試2-1" : {
        self: 6,
        overview: 13
      },
      "子測試3-1" : {
        self: 7,
        overview: 7
      }
    }
  }
}
const zippedData = (data) => {
  let result = []
  for(let aspect in data)
    for(let keypoint in data[aspect])
      for(let method in data[aspect][keypoint]){
        result.push({
          aspect: aspect,
          keypoint : keypoint,
          method: method,
          self: data[aspect][keypoint][method].self,
          overview: data[aspect][keypoint][method].overview,
        })
      }
  let labels = []
  Object.keys(data).map(aspect => {
    labels.push(aspect)
    Object.keys(data[aspect]).map( keypoint => {
      labels.push(keypoint)
      Object.keys(data[aspect][keypoint]).map( method => {
        labels.push(method)
      })
    })
  })
  return {result,labels}
}

var t = zippedData(data)


console.log(t)