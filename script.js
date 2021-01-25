function validate() {
  var streamUrl = document.querySelector("#streamUrl").value;
  var codecs = getCodecs(streamUrl);
  console.log(codecs);
  var supported = isAnySupported(codecs);
  processAnswer(supported);
}

function processAnswer(supported) {
  var container = document.querySelector("#supported");
  if (!supported) {
    container.innerText = "Your stream is not supported on this browser.";
  } else if (supported == "maybe") {
    container.innerText = 'Your stream is "maybe" supported. You can read up on what "maybe" means at https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType';
  } else {
    container.innerText = 'Your stream is "probably" supported on this browser. You can read up on what "probably" means at https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType.';
  }
}

function getCodecs(streamUrl) {
  var body = getBody(streamUrl);
  if (!body) {
    return false;
  }
  var codecs = processBody(body);
  return codecs;
}

function canPlayType(video, codec) {
  return video.canPlayType('video/mp4;codecs="'+codec+'"');
}
function isAnySupported(codecs) {
  var video = document.createElement('video');
  var supported = false;
  for (var i = 0; i < codecs.length; i++) {
    var canPlay = canPlayType(video, codecs[i]);
    if (canPlay == "probably") {
      supported = true;
    } else if (canPlay == "maybe") {
      supported = "maybe";
    }
  }
  
  return supported;
}

function getBody(streamUrl) {
  var request = new XMLHttpRequest();
  request.open('GET', streamUrl, false);
  request.send(null);
  if (request.status === 200) {
    return request.responseText;
  } else {
    return false;
  }
}

function processBody(body) {
  var isHls = body.indexOf("EXTM3U") > -1;
  var codecs = [];
  if (isHls) {
    codecs = body.match(/CODECS="[^"]*/g);
    codecs = codecs.map((value) => {
      return value.substr(8, value.length);
    })
  } else {

  }
  return codecs;
}

document.querySelector('#validate').addEventListener('click', validate);