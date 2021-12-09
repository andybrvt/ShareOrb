// DEVELOPMENT GLOBAL CONST
global.API_ENDPOINT = "http://127.0.0.1:8000"
global.IMAGE_ENDPOINT = "http://127.0.0.1:8000"
global.WS_ENDPOINT = "127.0.0.1:8000"
global.NEWSFEED_PICS = 'http://127.0.0.1:8000/media/'
global.POSTLIST_SPEC = 'http://127.0.0.1:8000/media/'
global.WS_HEADER = "ws"
global.BLOB_URL = "blob:http://localhost:3000/"

// DEPLOYMENT GLOBAL CONST
// global.API_ENDPOINT = "http://api.shareorb.com"
// global.IMAGE_ENDPOINT = ""
// global.WS_ENDPOINT = "api.shareorb.com"
// global.NEWSFEED_PICS = 'http://shareorb.s3.amazonaws.com/'
// global.POSTLIST_SPEC = "http://shareorb.s3.amazonaws.com/"
// global.WS_HEADER = "ws"


// DEPLOYMENT FOR CLOUDFRONT
// global.API_ENDPOINT = "https://api.shareorb.com"
// global.POSTLIST_SPEC = "https://shareorb.s3.amazonaws.com/"
// global.NEWSFEED_PICS = ''
// global.WS_HEADER = "wss"
// global.IMAGE_ENDPOINT = ""
// global.WS_ENDPOINT = "api.shareorb.com"

global.FILE_NAME_GETTER = (fileURI) => {

  const fileName = fileURI.split("/").pop()

  let match = /\.(\w+)$/.exec(fileName);
  let type = match ? match[1] === "mov" ? "mov" : `image/${match[1]}` : `image`;


  return {
    uri: fileURI,
    type: type,
    name: fileName,
  }

}
