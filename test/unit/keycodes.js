describe('_keyCodeFromAlias', function() {
  var pInst, _warn, _keyCodeFromAlias;
  var KEY = p5.prototype.KEY;

  beforeEach(function() {
    pInst = new p5(function() {});
    _keyCodeFromAlias = pInst._keyCodeFromAlias.bind(pInst);

    // Stub p5.prototype._warn to hide console output during tests
    // and allow sensing console output as needed.
    _warn = sinon.stub(p5.prototype, '_warn');
  });

  afterEach(function() {
    // Restore original p5.prototype._warn so we don't affect other tests.
    _warn.restore();
    pInst.remove();
  });

  describe('key aliases', function() {
    it('maps every alias to a numeric keycode', function() {
      for (var alias in KEY) {
        if (KEY.hasOwnProperty(alias)) {
          expect(typeof _keyCodeFromAlias(alias)).to.equal('number');
        }
      }
    });

    it('is case-insensitive', function() {
      var upperCaseAlias, lowerCaseAlias, randomCaseAlias;
      for (var alias in KEY) {
        if (KEY.hasOwnProperty(alias)) {
          upperCaseAlias = alias.toUpperCase();
          lowerCaseAlias = alias.toLowerCase();
          randomCaseAlias = alias
            .split('')
            .map(function(char) {
              if (Math.random() < 0.5) {
                return char.toUpperCase();
              } else {
                return char.toLowerCase();
              }
            })
            .join('');

          expect(_keyCodeFromAlias(upperCaseAlias))
            .to.equal(_keyCodeFromAlias(lowerCaseAlias))
            .to.equal(_keyCodeFromAlias(randomCaseAlias));
        }
      }
    });

    it('does not warn when looking up a regular alias', function() {
      for (var alias in KEY) {
        if (KEY.hasOwnProperty(alias)) {
          _keyCodeFromAlias(alias);
          expect(_warn.callCount).to.equal(0);
        }
      }
    });

    it('maps MINUS to 109', function() {
      expect(_keyCodeFromAlias('MINUS')).to.equal(109);
    });

    it('maps COMMA to 188', function() {
      expect(_keyCodeFromAlias('COMMA')).to.equal(188);
    });
  });

  describe('deprecated aliases', function() {
    var KEY_DEPRECATIONS = p5.prototype.KEY_DEPRECATIONS;

    it('maps every deprecated alias to a valid key alias', function() {
      for (var alias in KEY_DEPRECATIONS) {
        if (KEY_DEPRECATIONS.hasOwnProperty(alias)) {
          expect(KEY).to.include.keys(KEY_DEPRECATIONS[alias]);
        }
      }
    });

    it('does not include any deprecated aliases in key aliases', function() {
      for (var alias in KEY_DEPRECATIONS) {
        if (KEY_DEPRECATIONS.hasOwnProperty(alias)) {
          expect(KEY).to.not.include.keys(alias);
        }
      }
    });

    it('aliases \'MINUT\' to \'MINUS\'', function() {
      expect(_keyCodeFromAlias('MINUT'))
        .to.equal(_keyCodeFromAlias('MINUS'));
    });

    it('warns when using MINUT', function() {
      _keyCodeFromAlias('MINUT');
      expect(_warn.firstCall.args[0])
        .to.equal('Key literal "MINUT" is deprecated and may be removed in a ' +
                  'future version of p5.play. Please use "MINUS" instead.');
    });

    it('aliases \'COMA\' to \'COMMA\'', function() {
      expect(_keyCodeFromAlias('COMA'))
        .to.equal(_keyCodeFromAlias('COMMA'));
    });

    it('warns when using COMA', function() {
      _keyCodeFromAlias('COMA');
      expect(_warn.firstCall.args[0])
        .to.equal('Key literal "COMA" is deprecated and may be removed in a ' +
                  'future version of p5.play. Please use "COMMA" instead.');
    });
  });
});
