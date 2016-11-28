<!--

   Copyright 2016 Maciej Chałapuk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

-->

# Adding Custom Themes

Themes which are built-in into HyperText Slider ([`ht-theme--white`][theme-white],
[`ht-theme--black`][theme-black]) are very basic. They define background
color and contrast color for foreground elements, nothing more. They are very
useful when hacking a slider prototype, but production sliders should use other
themes which define more color variants, styling for controls and typography.

[theme-white]: class-names.md#ht-theme--white
[theme-black]: class-names.md#ht-theme--black

## Defining a Theme

Themes are defined in CSS but, as the rules can be quite complicated, using
a CSS preprocessor ([Sass][sass], [less][less]) is highly recommended. Examples
in this document use Sass.

[sass]: https://github.com/sass/sass
[less]: https://github.com/less/less.js

### Colors

Example below defines a theme with a red background color and very contrasting
white foreground elements.

```sass
.ht-theme--red {
  .ht-layout--background {
    background-color: red;
  }

  .ht-layout--content,
  .ht-layout--arrow {
    color: white;
  }

  .ht-layout--dot {
    background-color: rgba(255, 255, 255, 0.4);
    border-color: white;

    &.is-active {
      background-color: rgb(255, 255, 255);
    }
  }
}
```

> **NOTE**
>
> Above colors are very simple, production-ready themes should specify slightly
> different text colors for different text elements. It is recommended to use
> style guides such as [Material Design][material-design-colors].

[material-design-colors]: https://material.google.com/style/typography.html#typography-other-typographic-guidelines

### Controls

Default arrow styling uses `<` and `>` signs in `::after` pseudo-element.
These will look good (or not) depending on the font in use, and will definitely
not fit in every design. Following theme changes arrow styling so that they
use svg images.

```sass
.ht-theme--fancy-arrows {
  .ht-layout--arrow-left {
    &::after {
      content: "", /* to remove default arrows */
    }
    background-image: url('images/fancy-arrow-left.svg');
  }
  .ht-layout--arrow-right {
    &::after {
      content: "", /* to remove default arrows */
    }
    background-image: url('images/fany-arrow-right.svg');
  }
}
```

Default dot styling uses `border-radius` and `background-color`.
The same techinique can be used to change it.

### Typography

Theme can also specify typography rules for a slide.

```sass
.ht-theme--roboto {
  .ht-layout--content {
    font-family: Roboto, Helvetica, sans-serif;

    p {
      font-weight: 300;
      font-size: 20px;
      line-height: 24px;
    }

    h1 {
      font-size: 45px;
      line-height: 45px;
    }
  }
}
```

> **NOTE**
>
> Above example is very simple. In production code, it is recommended
> to define typography styles based on information from style guide
> like [Material Design][material-design-typography] and utilities like
> [Sassline][sassline].

[material-design-typography]: https://material.google.com/style/typography.html#typography-typeface
[sassline]: https://github.com/jakegiltsoff/sassline

## Using Themes

To use a theme, add its class name on the slider element or on specific
slide. Themes can be combined (many themes declared on one slide), which
enables declaring color themes separately from typography.

```html
<div class="ht-slider
            ht-defaults
            ht-theme--black
            ht-theme--roboto">
  <div id="hello" class="ht-theme--red
                         ht-theme--roboto">
    <h1>Hello!!!</h1>
  </div>
  <div id="bye">
    <h1>Bye...</h1>
  </div>
</div>
```

In example above, first slide uses `ht-theme--red` and
`ht-theme--roboto` themes. Second slide uses `ht-theme--black`
and `ht-theme--roboto` (rewriten from slider elemenet during
[DOM upgrade](dom-upgrade.md)).

