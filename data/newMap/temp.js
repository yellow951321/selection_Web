let fs = require('fs');
let data = fs.readFileSync('newMapping.json', 'utf8');
data = JSON.parse(data);
let newData = [];
for( let x in data){
    let newAspect = { shortTerm: x, midLongTerm: x,'label': '', 'keypoint': []};
    for(let y in data[x]){
        let newKeypoint = { shortTerm: y, midLongTerm: '', label: '', method: []}
        for(let z in data[x][y])
            newKeypoint['method'].push({ shortTerm: z, midLongTerm: '', label: ''})
        for(let z in newKeypoint['method']){
            let ind = parseInt(z) + 1;
            if (ind < 10)
                ind = '0' + ind;
            else
                ind = ind.toString();
            newKeypoint['method'][z]['label'] = ind;
        }
        newAspect['keypoint'].push(newKeypoint)
    }
    for(let y in newAspect['keypoint']){
        let ind = parseInt(y) + 1;
        if (ind < 10)
            ind = '0' + ind;
        else
            ind = ind.toString();
        newAspect['keypoint'][y]['label'] = ind;
    }
    newData.push(newAspect)
}


newData[0]['label'] = 'B'
newData[1]['label'] = 'C'
newData[2]['label'] = 'D'
newData[3]['label'] = 'E'
newData[4]['label'] = 'F'

newData = JSON.stringify(newData, null, 2)

fs.writeFileSync('outputMap.json', newData);