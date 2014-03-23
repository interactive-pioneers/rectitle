'use strict';
/* jshint undef: false */
(function () {
  describe('rectitle', function () {

    var config = {
      fontFamily: 'Arial',
      fontSize: 12,
      id: 'rectitle-007',
      backgroundPadding: {
        left: 15,
        top: 15,
        right: 15,
        bottom: 15
      },
      opacity: 0.8
    };
    var rectitle;

    describe('init', function () {
      beforeEach(function() {
        rectitle = new RecTitle(config);
      });
      it('expected to construct object', function () {
        return expect(rectitle).to.be.an.object;
      });
      it('expected to set font size to ' + config.fontSize, function() {
        return expect(rectitle.options.fontSize).to.equal(config.fontSize);
      });
      it('expected to set font family to ' + config.fontFamily, function() {
        return expect(rectitle.options.fontFamily).to.equal(config.fontFamily);
      });
      it('expected to set element ID to ' + config.id, function() {
        return expect(rectitle.view.getAttribute('id')).to.equal(config.id);
      });
      it('expected to have background padding set to ' + config.backgroundPadding.toString(), function() {
        return expect(rectitle.options.backgroundPadding).to.equal(config.backgroundPadding);
      });
      it('expected to not set transform matrix', function() {
        return expect(rectitle.hasTransformMatrix()).to.be.not.ok;
      });
      it('expected to set transform matrix', function() {
        config.horizontalSkew = -0.05;
        return expect(rectitle.hasTransformMatrix()).to.be.ok;
      });
      it('expected to set opacity', function() {
        return expect(rectitle.options.opacity).to.equal(config.opacity);
      });
      it('expected to parse pixel font size', function() {
        config.fontSize = '34px';
        rectitle = new RecTitle(config);
        return expect(rectitle.options.fontSize).to.equal(34);
      });
      it('expected to parse point font size', function() {
        config.fontSize = '34pt';
        rectitle = new RecTitle(config);
        return expect(rectitle.options.fontSize).to.equal(34);
      });
      it('expected to throw type error on non-pixel, non-numeric font size', function() {
        function test() {
          rectitle = new RecTitle({fontSize: '34em'});
        }
        return expect(test).to.throw(TypeError);
      });
      it('expected to not set mask on undefined', function() {
        return expect(rectitle.options.mask).to.be.false;
      });
      it('expected to not set mask on 0', function() {
        config.mask = '0';
        rectitle = new RecTitle(config);
        return expect(rectitle.options.mask).to.be.false;
      });
      it('expected to set mask on "true"', function() {
        config.mask = 'true';
        rectitle = new RecTitle(config);
        return expect(rectitle.options.mask).to.be.true;
      });
      it('expected to set mask on "1"', function() {
        config.mask = '1';
        rectitle = new RecTitle(config);
        return expect(rectitle.options.mask).to.be.true;
      });
      it('expected to not set mask on "something"', function() {
        config.mask = 'something';
        rectitle = new RecTitle(config);
        return expect(rectitle.options.mask).to.be.false;
      });
    });

    describe('render', function() {

      var headline = document.createElement('h2');
      var major = document.createElement('span');
      var textString = 'Hello World!';
      var text = document.createTextNode(textString);
      major.setAttribute('class', 'cutout');
      major.setAttribute('data-fontsize', 35);
      headline.appendChild(major);
      var minor = document.createElement('span');
      minor.setAttribute('data-fontsize', 78);
      headline.appendChild(minor);
      document.body.appendChild(headline);
      var target;

      beforeEach(function() {
        var targets = document.getElementsByClassName('cutout');
        target = targets[0];
        rectitle = new RecTitle(config);
      });
      it('expected to have rectitle initialised', function() {
        return expect(rectitle).to.exist;
      });
      it('expected to have target defined for testing', function() {
        return expect(target).to.exist;
      });
      it('expected to throw TypeError without target', function() {
        return expect(rectitle.render).to.throw(TypeError);
      });
      it('expected to throw TypeError on non-HTML target', function() {
        var test = function() {
          var fakeTarget = {name: 'fakeObject'};
          rectitle.render(fakeTarget);
        };
        return expect(test).to.throw(TypeError);
      });
      it('expected to throw TypeError on empty target', function() {
        var test = function() {
          rectitle.render(target);
        };
        return expect(test).to.throw(TypeError);
      });
      it('expected to not throw Error on preset target', function() {
        target.appendChild(text);
        rectitle.setTarget(target);
        var test = function() {
          rectitle.render();
        };
        return expect(test).to.not.throw(Error);
      });
      it('expected to calculate non-zero text width', function() {
        return expect(rectitle.getTextWidth('Hello world')).to.be.above(1);
      });
      it('expected to get text from non-empty target', function() {
        target.appendChild(text);
        rectitle.setTarget(target);
        return expect(rectitle.getText()).to.be.not.empty;
      });

      it('expected to render canvas object', function() {
        target.appendChild(text);
        var test = function() {
          rectitle.render(target);
        };
        return expect(test).to.be.object;
      });
      it('expected to empty the target', function() {
        target.appendChild(text);
        target.appendChild(text);
        rectitle.setTarget(target);
        return expect(rectitle.emptyTarget().innerHTML).to.be.empty;
      });
      it('expected to render canvas object replacing target', function() {
        target.appendChild(text);
        var renderedView = rectitle.render(target);
        return expect(renderedView).to.equal(rectitle.view);
      });
      it('expected to not render canvas object replacing target', function() {
        var canvasElements = document.querySelectorAll('canvas');
        for (var i = 0, l = canvasElements.length; i < l; i++) {
          canvasElements[i].parentNode.removeChild(canvasElements[i]);
        }
        target.appendChild(text);
        rectitle.render(target, true);
        var matches = document.querySelectorAll('canvas');
        return expect(matches.length).to.equal(0);
      });

      describe('set text considering text transform', function() {
        beforeEach(function() {
          target.appendChild(text);
          rectitle.setTarget(target);
        });
        it('expected to get uppercase text', function() {
          major.setAttribute('style', 'text-transform:uppercase;');
          return expect(rectitle.getText()).to.equal(textString.toUpperCase());
        });
        it('expected to get lowercase text', function() {
          major.setAttribute('style', 'text-transform:lowercase;');
          return expect(rectitle.getText()).to.equal(textString.toLowerCase());
        });
        it('expected to get capitalized text', function() {
          major.setAttribute('style', 'text-transform:capitalize;');
          return expect(rectitle.getText()).to.equal(textString.charAt(0).toUpperCase() + textString.slice(1));
        });
      });
    });
  });
})();
