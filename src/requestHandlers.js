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
    //console.log('got get file request');
    let names = await fsp.readdir(dir);
    let fileMetadatas = [];
    let folderMetadatas = [];
    if (names) {
      for (let i = 0; i < names.length; i++) {
        // abosolute path
        let filePath = path.join(dir, names[i]);
        // read metadata
        let stats = await fsp.stat(filePath);

        if (stats.isFile()) {
          fileMetadatas.push(_getMetadata(stats, names[i]))
        }
        if (stats.isDirectory()) {
          folderMetadatas.push(_getMetadata(stats, names[i]))
        }

      }
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ files: fileMetadatas, folders: folderMetadatas }));
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
  //console.log(fileName, path.join(dir, fileName))
  let stream = fs.createReadStream(path.join(dir, fileName));
  // This will wait until we know the readable stream is actually valid before piping
  stream.on('open', () => { response.writeHead(200, { "Content-Type": mime.getType(fileName) }); stream.pipe(response) });
  // when finish
  stream.on('end', () => response.end());
  // on error: usually invalid path
  stream.on('error', err => _notFound(response, err))
}

function _getMetadata(stats, name) {
  return {
    name,
    size: stats.size,
    type: mime.getType(name),
    created_at: stats.birthtime
  }
}

function _notFound(response, reason) {
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  response.end(reason.message)
}



exports.start = start;
exports.localFiles = localFiles;
exports.localFile = localFile;