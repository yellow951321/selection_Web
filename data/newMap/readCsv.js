const fs = require('fs')
const csv = require('csv-parser')
let results = []

let data = fs.readFileSync('outputMap.json', 'utf8');
data = JSON.parse(data);


fs.createReadStream('download.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        for( let x in results){
            let aspect = '';
            aspect = results[x]['構面']
            for(let dx in data){
                if(data[dx]['shortTerm'] === aspect){
                    aspect = dx
                    break;
                }
            }
            let keypoint = results[x]['推動重點'];
            for(let dx in data[aspect]['keypoint']){
                if(data[aspect]['keypoint'][dx]['shortTerm'] === keypoint){
                    keypoint = dx;
                    break;
                }
            }
            let method = results[x]['原北大做法統一用詞']
            for(let dx in data[aspect]['keypoint'][keypoint]['method']){
                if(data[aspect]['keypoint'][keypoint]['method'][dx]['shortTerm'] === method){
                    method = data[aspect]['keypoint'][keypoint]['method'][dx];
                    console.log(method);
                    break;
                }
            }
        }
    });

