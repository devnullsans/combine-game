const fs = require('fs');
const path = require('path');
const http = require('http');

const Data = {};
const Route = process.env?.SCAN ?? process.argv[2] ?? process.cwd();

load(Route);

const Server = http.createServer(serve).listen(8080, function() {
  console.log('Server is up:', Server.address());
  console.log(Route, JSON.stringify(Object.getOwnPropertyNames(Data), null, 2));
});

function load(directory) {
  if (fs.statSync(directory, { throwIfNoEntry: false })?.isDirectory())
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function(entry) {
      const route = path.join(directory, entry.name);
      if (entry.isFile()) Data[route] = fs.readFileSync(route);
      else if (entry.isDirectory()) load(route);
    });
}

function serve(request, response) {
  if (request.method === 'GET') {
    console.log(`GET ${request.url} => [${(Route+request.url).substring(3)}]`);
    const page = Data[(Route+request.url).substring(3)];
    if (page) return response.writeHead(200).end(page);
  } return response.writeHead(404).end(`<h4>Requested resource <i>${request?.url}</i> not found.</h4>`);
}
