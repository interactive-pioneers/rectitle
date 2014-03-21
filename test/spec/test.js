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
        rectitle = new RecTitle(config);
        return expect(rectitle.hasTransformMatrix()).to.be.ok;
      });
      it('expected to set opacity', function() {
        return expect(rectitle.options.opacity).to.equal(config.opacity);
      });
    });

    describe('render', function() {

      var headline = document.createElement('h2');
      var major = document.createElement('span');
      var text = document.createTextNode('Hello World!');
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
    });

  });
})();
