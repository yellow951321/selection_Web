const { parseSchema, outputFile, } = require('./parseSchema')


const test = async(input_path, output_path) => {
  var result = await parseSchema(input_path)
  result = result.methodLabel.filter((val, index, arr) => {
    return arr.indexOf(val) == index
  })
  result = JSON.stringify(result, null, 2)
  await outputFile(output_path, result)
}

test('../projectSchema.json', 'oldMapping.json')