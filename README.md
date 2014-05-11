# rectitle  [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/interactive-pioneers/rectitle.png?branch=master)](https://travis-ci.org/interactive-pioneers/rectitle) [![Bower version](https://badge.fury.io/bo/rectitle.png)](http://badge.fury.io/bo/rectitle)

Dynamic HTML 5 Canvas title component with horisontal skewing and masking.

<img src="app/images/example-headline.png" alt="Example headline" style="width:327px;">

## Installation
`bower install rectitle`

## Browser requirements

| IE | Safari | Google Chrome | Firefox | Opera |
|----|--------|---------------|---------|-------|
| 9+ | 7+   | 31+           | 26+      | 19+    |

## Example
### With WebFont support (achieving the example image above)
```html
<!doctype html>
<html>
<head>
  <title>rectitle WebFont example</title>
  <link href='http://fonts.googleapis.com/css?family=Elsie' rel='stylesheet' type='text/css'>
  <script src="//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"></script>
</head>
<body>
  <h1>headline</h1>
  <script src="scripts/rectitle.js"></script>
  <script>
    var heading = document.querySelectorAll('h1')[0];
    var config = {
      backgroundColor: '#000',
      mask: true,
      horizontalSkew: -0.05,
      backgroundPadding: {
        left: 10,
        top: 10,
        bottom: 10,
        right: 10
      },
      backgroundOpacity: 0.8,
      fontFamily: 'Elsie'
    };
    WebFont.load({
      active: function() {
        var rectitle = new RecTitle(config);
        rectitle.render(heading);
      },
      google: {
        families: ['Elsie']
      }
    });
  </script>
</body>
</html>
```

### With system font
```html
<h1>Headline</h1>
<script src="scripts/rectitle.js"></script>
<script>
  var heading = document.querySelectorAll('h1')[0];
  var config = {
    backgroundColor: '#000',
    mask: true,
    horizontalSkew: -0.05,
    backgroundPadding: {
      left: 10,
      top: 10,
      bottom: 10,
      right: 10
    },
    opacity: 0.8
  };
  var rectitle = new RecTitle(config);
  rectitle.render(heading);
</script>
```

# Options

| Option | Description |
|--------|-------------|
| `backgrounColor` | String. Colour of the rectangle background (hex) |
| `backgroundOpacity` | Number. Opacity of the rectangle (0-1) |
| `backgroundPadding` | Object. Padding of the content in rectangle on all edges (top, right, bottom, left; see [Example](#example)) |
| `opacity` | Number. Overall opacity of all grapihcs, incl. text (0-1) |
| `mask` | Boolean. Whether or not text masks the rectangle |
| `horizontalSkew` | Number. Skew amount for transformation matrix |
| `fontFamily` | String. Font family, same as CSS `font-family` |
| `fontSize` | Number. Font size |
| `fontColor` | String. Hex colour code |
| `className` | Element class name attribute appended to canvas element |
| `id` | Element ID attribute appended to canvas element |

## Releases
See [release tags](https://github.com/interactive-pioneers/rectitle/releases).

## Contributions
Contributions are regulated as regular, fork, create a contribution-specific branch and send a Pull Request.
### Development setup
1. `npm i` to install Node.js dependencies
2. `grunt server` to run server which runs tests automatically whenever `src/rectitle.js` is changed.
3. If dealing with WebFonts, check into [Google Web Font Loader](http://developers.google.com/fonts/docs/webfont_loader).

## License
[GPL](https://raw.githubusercontent.com/interactive-pioneers/rectitle/master/LICENSE)
