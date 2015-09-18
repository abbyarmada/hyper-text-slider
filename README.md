
# Utilizing [CSS3 transitions](http://www.w3.org/TR/css3-transitions/)

Hermes comes with:

 * configurable background an content transitions (and big transition library),
 * responsiveness (automatically adjusts it's layout to screen resolution),
 * extendability (adding new transtitions is very simple),
 * component-based approach (each feature can be enabled separately),
 * HTML/CSS programming interface (no JavaScript coding required).

## Getting the Code

Preferred way to get hermes is to use [bower](http://bower.io/).
```
bower install hermes --save-dev
```

You can also clone it with [git](https://git-scm.com/).
```
git clone https://github.com/webfront-toolkit/hermes.git
```

Package is not published in [npm](https://www.npmjs.com/).

## Hello, Hermes!

First things to do is adding CSS links to `hermes.css` and declarations of [CSS3
transitions](http://www.w3.org/TR/css3-transitions/) that will be used by the
slider. This typically goes inside the `<head>` element.

```html
<link href=bower_components/hermes/dist/hermes.min.css
      rel=stylesheet type=text/css>
<link href=bower_components/hermes/dist/transitions/zoom-in-out.min.css
      rel=stylesheet type=text/css>
```

Slider is controlled by class names set on its element. JavaScript interface is
also available, but rarely needed. In most cases only HTML declaration of the
slider and some CSS for slides' content is required. As CSS for the content is
not relevant in this example, it is not included.

```html
<div class="hermes-layout--slider
            hermes-transition--zoom-in-out
            hermes-slide-time-5-sec
            hermes-defaults">
  <div class="hermes-layout--slide" id="hello">
    <h1>Hello, Hermes!</h2>
  </div>
  <div class="hermes-layout--slide" id="transitions">
    <p>God of Transitions.</p>
  </div>
</div>
```

All `hermes-layout--*` class names are mandatory. They are used to identify
element roles inside a slider. `hermes-transition--*` classes identify
transitions that will be used to move from one slide to another. They may be
used on slider element or on each slide separately. There are a lot of classes
that turn on Hermes' optional features. `hermes-defaults` is an flag that turns
on a group of commonly used options. Please see documentation for details.

Last thing to do is upgrading all sliders on the page. This is done by adding
one `<script>` tag to the page, which is typically done at the bottom of the
`<body>` element.

```html
<script src=bower_components/hermes/dist/hermes.min.js type=text/javascript>
</script>
```

