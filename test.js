const { Client } = require('@elastic/elasticsearch')
require('dotenv').config()
const fs = require('fs')

const readCsv = (fileName) => {
  const csv = fs.readFileSync(fileName, 'utf8')
  var arr = csv.toString().split('\n')
  var jsonObj = []
  var headers = arr[0].split(',')
  for (var i = 1; i < arr.length; i++) {
    var data = arr[i].split(',')
    var obj = {}
    for (var j = 0; j < data.length; j++) {
      obj[headers[j].trim()] = data[j].trim()
    }
    jsonObj.push(obj)
  }
  return jsonObj
}

const data = readCsv('./data/Premios2020.csv')

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
})

async function searchElastic(index, query) {
  const response = await client.search({
    index: index,
    body: {
      query: {
        match: {
          Film: query,
        },
      },
    },
  })
  return response.hits.hits
}

async function addAll(data, index) {
  client
    .bulk({
      body: data.map((doc) => [{ index: { _index: index } }, doc]).flat(),
    })
    .then(console.log)
    .catch(console.log)
}

//addAll(data, 'premios')
searchElastic('premios', 'Last')
  .then((res) => {
    console.log(res)
  })
  .catch(console.log)
