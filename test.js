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

const data = readCsv('./Premios2020.csv')
//console.log(data)

console.log(process.env.ELASTIC_URL)
const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false,
  },
})

async function search(index, query) {
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

//async function add() {
//  const response = await client.index({
//    index: 'books',
//    document: {
//      name: 'Snow Crash',
//      author: 'Neal Stephenson',
//      release_date: '1992-06-01',
//      page_count: 470,
//    },
//  })
//  console.log(response)
//}

async function addAll(data, index) {
  client
    .bulk({
      body: data.map((doc) => [{ index: { _index: index } }, doc]).flat(),
    })
    .then(console.log)
    .catch(console.log)
}

//add()
//search()
//  .then((res) => {
//    //console.log(res)
//    console.log(res.hits.hits)
//  })
//  .catch(console.log)

//addAll(data, 'premios')
search('premios', 'Last')
  .then((res) => {
    console.log(res)
  })
  .catch(console.log)
