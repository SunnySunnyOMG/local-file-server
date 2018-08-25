const querystring = require("querystring"),
  fsp = require("fs").promises,
  fs = require("fs"),
  path = require("path"),
  mime = require('mime'),
  url = require("url");


function start(response) {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.write('Hello word');
  response.end();
}


async function localFiles(response, request) {
  let { dir } = url.parse(request.url, true).query;
  if (!dir) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end('missing: dir')
  } else try {
    console.log('got get file request');
    let fileNames = await fsp.readdir(dir);
    let metadatas = [];
    if (fileNames) {
      for (let i = 0; i < fileNames.length; i++) {
        // abosolute path
        let filePath = path.join(dir, fileNames[i]);
        // read metadata
        let stats = await fsp.stat(filePath);
        if (stats.isFile()) {
          metadatas.push({
            name: fileNames[i],
            size: stats.size,
            type: mime.getType(fileNames[i]),
            created_at: stats.birthtime
          })
          console.log('read file:', {
            name: fileNames[i],
            size: stats.size,
            type: mime.getType(fileNames[i]),
            created_at: stats.birthtime
          })
        }
      }
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ files: metadatas }));
    } else {
      _notFound(response);
    }
  } catch (err) {
    // handle the error
    response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    response.end('internal error:' + JSON.stringify(err))
  }
}

function localFile(response, request) {
  let { fileName, dir } = url.parse(request.url, true).query;
  let stream = fs.createReadStream(path.join(dir, fileName));
  // This will wait until we know the readable stream is actually valid before piping
  stream.on('open', () => { response.writeHead(200, { "Content-Type": mime.getType(fileName) }); stream.pipe(response) });
  // when finish
  stream.on('end', () => response.end());
  // on error: usually invalid path
  stream.on('error', err => _notFound(response, err))
}

function _notFound(response, reason) {
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  response.end(reason.message)
}



exports.start = start;
exports.localFiles = localFiles;
exports.localFile = localFile;