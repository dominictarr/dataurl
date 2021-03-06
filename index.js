const REGEX = {
  dataurl: /data:(.*?)(?:;charset=(.*?))?(;base64)?,(.+)/i,
  newlines: /(\r)|(\n)/g
}

const MIME_INDEX = 1;
const CHARSET_INDEX = 2;
const ENCODED_INDEX = 3;
const DATA_INDEX = 4;

var dataurl = exports

function stripNewlines(string) {
  return string.replace(REGEX.newlines, '');
}

function isString(thing) {
  return typeof thing === 'string';
}

function makeHeader(options) {
  var dataUrlTemplate = 'data:' + options.mimetype;
  if (options.charset)
    dataUrlTemplate += ';charset=' + options.charset;
  if (options.encoded !== false)
    dataUrlTemplate += ';base64'
  dataUrlTemplate += ',';
  return dataUrlTemplate;
}

function makeDataUrlSync(header, data) {
  return (header + Buffer(data).toString('base64'));
}

dataurl.makeHeader = makeHeader

dataurl.convert = function (options) {
  const header = makeHeader(options);
  return makeDataUrlSync(header, options.data);
};

dataurl.stringify = dataurl.format = dataurl.convert;

dataurl.parse = function (string) {
  var match;
  if (!isString(string))
    return false;
  string = stripNewlines(string);
  if (!(match = REGEX.dataurl.exec(string)))
    return false;
  const encoded = !!match[ENCODED_INDEX];
  const base64 = (encoded ? 'base64' : null);
  const data = Buffer(match[DATA_INDEX], base64);
  const charset = match[CHARSET_INDEX];
  const mimetype = match[MIME_INDEX] || 'text/plain';
  return {
    mimetype: mimetype,
    charset: charset,
    data: data,
  }
};

