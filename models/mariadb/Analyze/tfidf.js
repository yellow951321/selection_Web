const User = require('../User/op')
const Year = require('../Year/op')
const Campus = require('../Campus/op')
const Dimension = require('../Dimension/op')
const Item = require('../Item/op')
const Detail = require('../Detail/op')
const Content = require('../Content/op')
// const Content = require('./op')

let stopwords = [
    '<',
    '>',
    ',',
    '.',
    '-',
    '&',
    '+',
    '*',
    '/',
    '!',
    '?',
    '？',
    '。',
    '，',
    '！',
    '＝',
    '=',
    '—',
    '、',
    '\'',
    '"',
    '[',
    ']',
    '{',
    '}',
    '(',
    ')',
    '_',
    '「',
    '」',
    '（',
    '）',
    '『',
    '』',
    '《',
    '》',
    '〈',
    '〉',
    '【',
    '】',
    '～',
    '~',
    ' ',
    '：',
    ':',
    '；',
    ';',
    '@',//new
    '〝',
    '〞',
]


Year.findYearAll(6)
.then(yearArr=>{
    return yearArr.map(yearObj=>yearObj.year_id)
})
.then(yearIdArr=>{
    return Promise.all(yearIdArr.map(year=>{
        return Campus.findCampusAll(year)
        .then(campusArr=>{
            return {
                year,
                campusArr: campusArr.map(campusObj=>campusObj.campus_id)
            }
        })
    }))
})
.then(arr=>{
    let newArr = [];
    arr.forEach(obj=>{
        obj.campusArr.forEach(campus=>{
            newArr.push({
                year: obj.year,
                campus
            })
        })
    })
    return newArr;
})
.then(arr=>{
    return Promise.all(arr.map(obj=>{
        return Dimension.findDimensionAll(obj.campus)
        .then(dimensionArr=>{
            return {
                year: obj.year,
                campus: obj.campus,
                dimensionArr: dimensionArr.map(dimensionObj=>dimensionObj.dimension_id)
            }
        })
    }))
})
.then(arr=>{
    let newArr = [];
    arr.forEach(obj=>{
        obj.dimensionArr.forEach(dimension=>{
            newArr.push({
                year: obj.year,
                campus: obj.campus,
                dimension,
            })
        })
    })
    return newArr;
})
.then(arr=>{
    return Promise.all(arr.map(obj=>{
        return Item.findItemAll(obj.dimension)
        .then(itemArr=>{
            return {
                year: obj.year,
                campus: obj.campus,
                dimension: obj.dimension,
                itemArr: itemArr.map(itemObj=>itemObj.item_id)
            }
        })
    }))
})
.then(arr=>{
    let newArr = [];
    arr.forEach(obj=>{
        obj.itemArr.forEach(item=>{
            newArr.push({
                year: obj.year,
                campus: obj.campus,
                dimension: obj.dimension,
                item,
            })
        })
    })
    return newArr;
})
.then(arr=>{
    return Promise.all(arr.map(obj=>{
        return Detail.findDetailAll(obj.item)
        .then(detailArr=>{
            return {
                year: obj.year,
                campus: obj.campus,
                dimension: obj.dimension,
                item: obj.item,
                detailArr: detailArr.map(detailObj=>detailObj.detail_id)
            }
        })
    }))
})
.then(arr=>{
    let newArr = [];
    arr.forEach(obj=>{
        obj.detailArr.forEach(detail=>{
            newArr.push({
                year: obj.year,
                campus: obj.campus,
                dimension: obj.dimension,
                item: obj.item,
                detail,
            })
        })
    })
    return newArr;
})
.then(arr=>{
    return Promise.all(arr.map(obj=>{
        return Content.findContentAll(obj.detail)
        .then(contentArr=>{
            return {
                year: obj.year,
                campus: obj.campus,
                dimension: obj.dimension,
                item: obj.item,
                detail: obj.detail,
                contentArr: contentArr.map(contentObj=>contentObj.content_content)
            }
        })
    }))
})
.then(arr=>{
    let newArr = [];
    arr.forEach(obj=>{
        obj.contentArr.forEach(content=>{
            newArr.push({
                year: obj.year,
                campus: obj.campus,
                dimension: obj.dimension,
                item: obj.item,
                detail: obj.detail,
                content,
            })
        })
    })
    return newArr;
})
.then(arr=>{
    let step = 100;

    for(let i=arr.length-1;i>=0;--i){
        for(let j=i-1;j>=0;--j){
            if(
                arr[i].year===arr[j].year &&
                arr[i].campus===arr[j].campus &&
                arr[i].dimension===arr[j].dimension &&
                arr[i].item===arr[j].item &&
                arr[i].detail===arr[j].detail
            ) {
                arr[j].content+=arr[i].content
                arr.splice(i,1)
                break;
            }
        } 
    }

    let dataArr = arr.map(obj=>{
        // console.log(`year: ${obj.year}`)
        // console.log(`campus: ${obj.campus}`)
        // console.log(`dimension: ${obj.dimension}`)
        // console.log(`item: ${obj.item}`)
        // console.log(`detail: ${obj.detail}`)

        let characters = Array.from(obj.content)
        .filter(character=>!stopwords.includes(character))

        let statistic = {}

        characters.forEach(character=>{
            if(statistic[character])
                statistic[character]+=1
            else
                statistic[character]=1
        })

        let sortChar = Reflect.ownKeys(statistic)
        sortChar.sort((char1, char2)=>{
            return statistic[char2] - statistic[char1]
        })

        // for(let i=0;i<10;++i){
        //     console.log(`${sortChar[i]}: ${statistic[sortChar[i]]}`)
        // }
        // let temp = []
        // for(let key in sortChar){
        //     temp.push(sortChar[key])
        // }
        return{
            year: obj.year,
            campus: obj.campus,
            dimension: obj.dimension,
            item: obj.item,
            detail: obj.detail,
            tf: statistic,
        }
    })
    // console.log(Object.keys(dataArr[0].year))
    // dataArr.forEach(dataObj=>{
    //     console.log(dataObj.tf)
    //     dataObj.tf.ownKeys.forEach(tfOne=>{
    //         dataArr.forEach(obj=>{
    //             obj.tf.ownKeys.forEach(tfTwo=>{
    //                 if(tfOne === tfTwo){
    //                     console.log('HIIIIIIIIIIIIIIIII')
    //                 }
    //             })
    //         })
    //     })
    // })
    let count = 0;
    let dfArr = []
    let tempObj = {};
    let develop = 0;
    let num_data = 0
    dataArr.forEach(obj=>{
        num_data++
    })
    // console.log(num_data)
    // console.log(dataArr)
    dataArr.forEach(dataObj=>{
        // console.log(++develop)
        ++develop
        if(develop > 2) return false

        tempObj = {}
        let tfOneArr = Object.keys(dataObj.tf)
        tfOneArr.forEach(word1=>{
            tempObj[word1] = 0;
        })
        dataArr.forEach(dataObj2=>{
            if(dataObj.year!==dataObj2.year || dataObj.campus!==dataObj2.campus){
                return;
            }else{
                // let tfOneArr = Object.keys(dataObj.tf)
                let tfTwoArr = Object.keys(dataObj2.tf)
                // tfOneArr.forEach(word1=>{
                    // tempObj[word1] = 0;
                // })
                // console.log(tfOneArr)
                ++count;
                if(count%10000 === 0)console.log(count)
                tfOneArr.forEach(word1=>{
                    tfTwoArr.forEach(word2=>{
                        if(word1 === word2){
                            // console.log(++count)
                            // dfArr.push({
                            //     year: dataObj.year,
                            //     campus: dataObj.campus,
                            //     dimension: dataObj.dimension,
                            //     item: dataObj.item,
                            //     detail: dataObj.detail,
                            //     idf:
                            // })
                            // console.log('word1 == 2')
                            let tempArr = Object.keys(tempObj)
                            // console.log(tempArr)
                            for(let i=0; i<tempArr.length; ++i){
                                if(tempArr[i] === word1){
                                    // console.log('+=1')
                                    tempObj[word1]+=1;
                                    break;
                                }
                            }
                        }
                    })
                })
            }
        })
        dfArr.push({
            year: dataObj.year,
            campus: dataObj.campus,
            dimension: dataObj.dimension,
            item: dataObj.item,
            detail: dataObj.detail,
            tf: dataObj.tf,
            idf: tempObj,
        })
    })

    // console.log(dfArr)
    // console.log('dfArr.length: '+ dfArr.length)
    // let sum = 0
    dfArr.forEach(obj=>{
        let sum = 0
        let tfValArr = Object.values(obj.tf)
        let tfKeyArr = Object.keys(obj.tf)
        for(let val in tfValArr){
            sum += tfValArr[val]
        }
        tfKeyArr.forEach(key=>{
            obj.tf[key] = (obj.tf[key]/sum)
            // console.log(obj.tf[key])
        })
        // console.log(sum)

        let idfKeyArr = Object.keys(obj.idf)
        idfKeyArr.forEach(key=>{
            obj.idf[key] = Math.log(num_data/obj.idf[key])
            // console.log(obj.idf[key])
        })
    })
    // console.log(dfArr)
    let dataTotal = []
    dfArr.forEach(obj=>{
        let tfVal = Object.values(obj.tf)
        let idfVal = Object.values(obj.idf)
        let tfKey = Object.keys(obj.tf)
        let tempObj = {}
        for(let index in tfVal){
            let temp = tfVal[index] * idfVal[index]
            tempObj[tfKey[index]] = temp
        }

        dataTotal.push({
            year: obj.year,
            campus: obj.campus,
            dimension: obj.dimension,
            item: obj.item,
            detail: obj.detail,
            tf_idf: tempObj,
        })
    })
    
    console.log(dataTotal)
})
