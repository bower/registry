const express = require('express')
const compression = require('compression')
const MiniSearch = require('minisearch')
const path = require('path')
const url = require('url')

const PORT = process.env.PORT || 3000

const packages = {}
let totalPackages = 0

const tokenize = MiniSearch.getDefault('tokenize')

const miniSearch = new MiniSearch({
  fields: ['name', 'url'],
  storeFields: ['name', 'url'],
  tokenize: (term, _fieldName) => {
    if (_fieldName === 'url') {
      return tokenize(
        // eslint-disable-next-line
        url
          .parse(term)
          .path.replace(/\.git$/, '')
          .toLowerCase()
      )
    } else {
      return tokenize(term.toLowerCase())
    }
  }
})

require('./db/packages.json').forEach(p => {
  packages[p.name] = p.url
  totalPackages += 1
  miniSearch.add(Object.assign({ id: totalPackages }, p))
})

const app = express()

app.use(compression())

app.get('/', function (req, res) {
  res.redirect(302, 'http://bower.io/search/')
})

app.get('/stats', function (req, res) {
  res.json({ packages: totalPackages })
})

app.get('/packages', (req, res) => {
  res.set({ 'Cache-Control': 'public, max-age=2419200' })
  res.sendFile(path.resolve(__dirname, 'db', 'packages.json'))
})

app.get('/packages/search/', (req, res) => {
  res.json(defaultSearch)
})

app.get('/packages/:name', (req, res) => {
  const pkg = packages[req.params.name]

  if (!pkg) {
    return res.status(404).send('Package not found')
  }

  res.set({ 'Cache-Control': 'public, max-age=2419200' })
  return res.json({ name: req.params.name, url: pkg })
})

app.get('/packages/search/:name', (req, res) => {
  res.json(
    miniSearch
      .search(req.params.name)
      .slice(0, 30)
      .map(p => ({
        name: p.name,
        url: p.url
      }))
  )
})

app.post('/packages', (req, res) => {
  return res
    .status(500)
    .send(
      'Registering bower package names is not supported anymore. You can install any bower package on github with command like "bower install jquery/jquery-dist --save"'
    )
})

app.delete('/packages/:name', (req, res) => {
  return res
    .status(500)
    .send(
      'Removing bower packages is not supported anymore. For emergencies please send pull-request against https://github.com/bower/registry'
    )
})

const defaultSearch = require('./db/search-defaults.json').map(f => ({
  name: f,
  url: packages[f]
}))

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
