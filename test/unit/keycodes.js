describe('keyCodeFromAlias_', function() {
  var lastConsoleMessage, originalWarnFunction;

  beforeEach(function () {
    // Stub p5.prototype.warn_ to hide console output during tests
    // and allow sensing console output as needed.
    originalWarnFunction = p5.prototype.warn_;
    p5.prototype.warn_ = function (msg) {
      lastConsoleMessage = msg;
    };

    lastConsoleMessage = undefined;
  });

  afterEach(function () {
    // Restore original p5.prototype.warn_ so we don't affect other tests.
    p5.prototype.warn_ = originalWarnFunction;
  });

  describe("key aliases", function () {
    it("maps every alias to a numeric keycode", function () {
      for (var alias in KEY) {
        expect(typeof keyCodeFromAlias_(alias)).to.equal('number');
      }
    });

    it('is case-insensitive', function () {
      var upperCaseAlias, lowerCaseAlias, randomCaseAlias;
      for (var alias in KEY) {
        upperCaseAlias = alias.toUpperCase();
        lowerCaseAlias = alias.toLowerCase();
        randomCaseAlias = alias.split('').map(function (char) {
          if (Math.random() < 0.5) {
            return char.toUpperCase();
          } else {
            return char.toLowerCase();
          }
        }).join('');

        expect(keyCodeFromAlias_(upperCaseAlias))
          .to.equal(keyCodeFromAlias_(lowerCaseAlias))
          .to.equal(keyCodeFromAlias_(randomCaseAlias));
      }
    });

    it("does not warn when looking up a regular alias", function () {
      for (var alias in KEY) {
        keyCodeFromAlias_(alias);
        expect(lastConsoleMessage).to.be.undefined;
      }
    });

    it("maps MINUS to 109", function () {
      expect(keyCodeFromAlias_('MINUS')).to.equal(109);
    });

    it("maps COMMA to 188", function () {
      expect(keyCodeFromAlias_('COMMA')).to.equal(188);
    });
  });

  describe("deprecated aliases", function() {
    it("maps every deprecated alias to a valid key alias", function () {
      for (var alias in KEY_DEPRECATIONS) {
        expect(KEY).to.include.keys(KEY_DEPRECATIONS[alias]);
      }
    });

    it("does not include any deprecated aliases in key aliases", function () {
      for (var alias in KEY_DEPRECATIONS) {
        expect(KEY).to.not.include.keys(alias);
      }
    });

    it("aliases 'MINUT' to 'MINUS'", function() {
      expect(keyCodeFromAlias_('MINUT'))
        .to.equal(keyCodeFromAlias_('MINUS'));
    });

    it("warns when using MINUT", function () {
      keyCodeFromAlias_('MINUT');
      expect(lastConsoleMessage)
        .to.equal('Key literal "MINUT" is deprecated and may be removed in a ' +
                  'future version of p5.play. Please use "MINUS" instead.');
    });

    it("aliases 'COMA' to 'COMMA'", function() {
      expect(keyCodeFromAlias_('COMA'))
        .to.equal(keyCodeFromAlias_('COMMA'));
    });

    it("warns when using COMA", function () {
      keyCodeFromAlias_('COMA');
      expect(lastConsoleMessage)
        .to.equal('Key literal "COMA" is deprecated and may be removed in a ' +
                  'future version of p5.play. Please use "COMMA" instead.');
    });
  });
});
