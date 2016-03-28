[![Build Status](https://travis-ci.org/molleindustria/p5.play.svg?branch=master)](https://travis-ci.org/molleindustria/p5.play)

p5.play is a p5.js library for the creation of games and playthings.

You can find examples and more information at [p5play.molleindustria.org][].

p5.play provides a Sprite class to manage visual objects in 2D space and features such as animation support, basic collision detection and resolution, sprite grouping, helpers for mouse and keyboard interactions, and a virtual camera. 

p5.play extends [p5.js][], a javascript library (and a community) that aims to make coding accessible for artists, designers, educators, and beginners. If you are not familiar with p5.js, you should start at [p5js.org/tutorials][].

## Development

The following documentation is for *developing* p5.play itself. If you
want to *use* p5.play, please see [p5play.molleindustria.org][].

### Quick Start

First install [node.js][]. Then run:

```
npm install
npm start
```

Your web browser should open to a welcome page. If it doesn't, visit
[localhost:8080][] in your browser.

### Unit Tests

To run the unit tests in your browser, visit [localhost:8080/test][].

To run them from the command-line, use `npm test`.

### Documentation

The docs can be found at [localhost:8080/docs][] or via the "Reference" link on
the quick start welcome page. 

Use `npm run docs` to regenerate the local documentation using [YUIDoc][].

A (mostly current) copy of the docs is also hosted at [p5play.molleindustria.org/docs][].

### Examples

Several example sketches are available at [p5play.molleindustria.org/examples][].

You can try these examples against your local copy of p5.play at
[localhost:8080/examples][] or via the "Examples" link on the quick start
welcome page. 

  [localhost:8080]: http://localhost:8080/
  [localhost:8080/test]: http://localhost:8080/test/
  [localhost:8080/docs]: http://localhost:8080/docs/
  [localhost:8080/examples]: http://localhost:8080/examples/
  [p5.js]: https://p5js.org
  [p5js.org/tutorials]: http://p5js.org/tutorials/
  [p5play.molleindustria.org]: http://p5play.molleindustria.org
  [p5play.molleindustria.org/docs]: http://p5play.molleindustria.org/docs/
  [p5play.molleindustria.org/examples]: http://p5play.molleindustria.org/examples/
  [node.js]: https://nodejs.org/en/
  [YUIDoc]: http://yui.github.io/yuidoc/
