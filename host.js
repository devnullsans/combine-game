const fs = require('fs');
const path = require('path');
const http = require('http');

const Data = new Map();
const mimes = require('./mimes.json');
const Route = process.env?.SCAN ?? process.argv[2] ?? process.cwd();

load(Route);

const Server = http.createServer(serve).listen(8080, function() {
  console.log('Server is up:', Server.address());
  // console.log(Route, JSON.stringify(Object.getOwnPropertyNames(Data), null, 2));
});

function load(directory) {
  if (fs.statSync(directory, { throwIfNoEntry: true })?.isDirectory())
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function(entry) {
      const route = path.join(directory, entry.name);
      if (entry.isFile()) Data.set(route, [fs.readFileSync(route), mimes[entry.name.substring(entry.name.lastIndexOf('.'))]]);
      else if (entry.isDirectory()) load(route);
    });
}

function serve(request, response) {
  if (request.method === 'GET') {
    console.log(`GET ${request.url} => [${Route + request.url}]`);
    const content = Data.get(Route + request.url);
    if (content) return response.writeHead(200, ['Content-Type', content[1]]).end(content[0]);
  } return response.writeHead(404, ['Content-Type', 'text/html']).end(`<h4>Requested resource <i>${request?.url}</i> not found.</h4>`);
}
