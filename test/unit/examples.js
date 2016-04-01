describe('Example sketches', function() {
  var FRAMES_TO_DRAW = 3;

  var iframe;
  var examples = (function findExamples() {
    var FILENAME_RE = /index\.html\?fileName=([A-Za-z0-9_.]+)/g;
    var examples = [];
    var req = new XMLHttpRequest();

    req.open('GET', '../examples/index.html', false);
    req.send(null);

    req.responseText.replace(FILENAME_RE, function(_, fileName) {
      examples.push(fileName);
    });

    return examples;
  }());

  // The following function's source code is converted to a string
  // and evaluated in an iframe; it is NOT executed directly!
  var iframeScript = function(parentWindowCbName, framesToDraw) {
    var framesDrawn = 0;
    var done = window.parent[parentWindowCbName];

    window.onerror = function(msg, source, lineno, colno, error) {
      if (!error) {
        // Some browsers, like PhantomJS, don't pass an error argument.
        return done(new Error(msg + ' @ ' + source + ':' + lineno));
      }
      done(error);
    };

    p5.prototype.registerMethod('post', function() {
      if (++framesDrawn === framesToDraw) {
        done();
      }
    });
  }.toString();

  beforeEach(function() {
    iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.style.visibility = 'hidden';
    iframe.style.width = '640px';
    iframe.style.height = '480px';
  });

  afterEach(function() {
    iframe.parentNode.removeChild(iframe);
  });

  examples.forEach(function(fileName) {
    var testName = fileName + ' runs for ' + FRAMES_TO_DRAW + ' frames';
    it(testName, function(done) {
      var windowCbName = 'example_' + fileName.slice(0, -3) + '_done';
      var iframeScriptArgs = [
        windowCbName,
        FRAMES_TO_DRAW
      ];
      var iframeScriptCode = (
        '(' + iframeScript + ').apply(window, ' +
        JSON.stringify(iframeScriptArgs) + ');'
      );
      window[windowCbName] = done;

      iframe.contentDocument.open();
      iframe.contentDocument.write([
        '<!DOCTYPE html>',
        '<meta charset="utf-8">',
        '<base href="../examples/">',
        '<title>Example: ' + fileName + '</title>',
        '<h1>Example: ' + fileName + '</h1>',
        '<div id="myP5"></div>',
        '<script src="../test/js/bind.js"></script>',
        '<script src="lib/p5.js"></script>',
        '<script>' + iframeScriptCode + '</script>',
        '<script src="../lib/p5.play.js"></script>',
        '<script src="' + fileName + '"></script>'
      ].join('\n'));
      iframe.contentDocument.close();
    });
  });
});
