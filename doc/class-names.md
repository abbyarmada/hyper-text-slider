

<!-- Start src/node/_layout.js -->

## Layout Class Names

name | usage | client | parent
---- | ----- | ------ | ------
hermes-layout--slider | role-id styling | mandatory | 
hermes-layout--slide | role-id styling | mandatory | hermes-layout--slider
hermes-layout--background | role-id styling transition | optional | hermes-layout--slide
hermes-layout--content | role-id styling transition | optional | hermes-layout--slide
hermes-layout--inner | transition | optional | hermes-layout--content
hermes-layout--arrow | styling | forbidden | hermes-layout--slider
hermes-layout--arrow-left | styling | forbidden | hermes-layout--slider
hermes-layout--arrow-right | styling | forbidden | hermes-layout--slider
hermes-layout--dots | styling | forbidden | hermes-layout--slider
hermes-layout--dot | styling | forbidden | hermes-layout--dots

## hermes-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

## hermes-layout--slide

Identifies a slide.

At least 2 slides must be defined in each slider.
It can be used in client CSS code for styling.

## hermes-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background element
will be generated during slider upgrade.

## hermes-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element.

If element is present in slider declaration, it must contain all contents of a slide.

## hermes-layout--inner

May be set on selected elements of content of a slide. Used in some transitions.

## hermes-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be user in slider declaration.

## hermes-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be user in slider declaration.

## hermes-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be user in slider declaration.

## hermes-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be user in slider declaration.

## hermes-layout--dot

Set during upgrade on each dot button element.

This class name must not be user in slider declaration.

<!-- End src/node/_layout.js -->

