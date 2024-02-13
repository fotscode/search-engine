const { Client } = require('@elastic/elasticsearch')
require('dotenv').config()
const fs = require('fs')

//const readCsv = (fileName) => {
//  const csv = fs.readFileSync(fileName, 'utf8')
//  var arr = csv.toString().split('\n')
//  var jsonObj = []
//  var headers = arr[0].split(',')
//  for (var i = 1; i < arr.length; i++) {
//    var data = arr[i].split(',')
//    var obj = {}
//    for (var j = 0; j < data.length; j++) {
//      obj[headers[j].trim()] = data[j].trim()
//    }
//    jsonObj.push(obj)
//  }
//  return jsonObj
//}
//
//const data = readCsv('./data/Premios2020.csv')

const readTxt = (fileName) => {
  const txt = fs.readFileSync(fileName, 'utf8')
  let arr = txt.toString().split('\n')
  jsonObj = []
  i = 0
  for (let s of arr) {
    // avoid even lines
    if (i % 2 == 0) {
      i++
      continue
    }
    jsonObj.push(JSON.parse(s))
    i++
  }
  return jsonObj
}
const data = readTxt('./data/movies.txt')

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
          title: query,
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

//addAll(data, 'movies')
searchElastic('movies', 'star')
  .then((res) => {
    console.log(res)
  })
  .catch(console.log)
