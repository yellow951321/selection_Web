const fs = require('fs')
const csv = require('csv-parser')
const test1 = require('./mapping').midLongTermFromWord
const test2 = require('./mapping').midLongTermFromNumber

let results = []

let data = fs.readFileSync('outputMap.json', 'utf8');
data = JSON.parse(data);


fs.createReadStream('download.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        for( let x in results){
            output = test1({
                aspect: results[x]['構面'],
                keypoint: results[x]['推動重點'],
                method: results[x]['具體做法'],
            })
            console.log(test2(output))
        }
        // for( let x in results){
        //     let aspect = '';
        //     aspect = results[x]['構面']
        //     for(let dx in data){
        //         if(data[dx]['shortTerm'] === aspect){
        //             aspect = dx
        //             break;
        //         }
        //     }
        //     let keypoint = results[x]['推動重點'];
        //     for(let dx in data[aspect]['keypoint']){
        //         if(data[aspect]['keypoint'][dx]['shortTerm'] === keypoint){
        //             keypoint = dx;
        //             break;
        //         }
        //     }
        //     let method = results[x]['原北大做法統一用詞']
        //     for(let dx in data[aspect]['keypoint'][keypoint]['method']){
        //         if(data[aspect]['keypoint'][keypoint]['method'][dx]['shortTerm'] === method){
        //             data[aspect]['keypoint'][keypoint]['method'][dx]['midLongTerm'] = results[x]['具體做法'];
        //             break;
        //         }
        //     }
        // }
        // data = JSON.stringify(data, null, 2);
        // fs.writeFileSync('final.json', data)
    });