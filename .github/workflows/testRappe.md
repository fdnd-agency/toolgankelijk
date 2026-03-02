## Describe the documentation task
In this issue you will see the results of testing on RAPPE principles. 

## Responsive
Test if the website works also on mobile phones. Follow the rule mobile-first so that you can build up from there. Before you start make sure that the link is available online (deployed)

- [ ] Works on iPhone
- [ ] Works on android 

## HTML validator
Validate your HTML and CSS with the W3C markup validation service. After you make your adjustments move on to the next heading.

## Progressive Enhancement
What is the core functionality of your feature? Make sure that the element is working without javascript and css.

##  User tests
Ask someone to test the website and give feedback about how the website is working for them.

## Lighthouse test
Run a lighthouse test on mobile and desktop and paste the screenshot of the results under this heading.

## A11Y checklist
The checklist is based on [this](https://www.a11yproject.com/checklist/) website. Added the most important factors in this markdown.

**Content**

- [ ] One language rule
- [ ] buttons, a and labels are descriptive
- [ ] LTR aligned text

**Global code**
- [ ] HTML validation
- [ ] lang element html
- [ ] title on each page
- [ ] viewport zoom is not disabled
- [ ] landmark elements
- [ ] tabindex check
- [ ] no autofocus
- [ ] avoid title at iframes

**Keyboard**
- [ ] focus is visible
- [ ] remove invisible focus elemtns

**Images**
- [ ]  alt attribute
- [ ] no alt at decorative images
- [ ] charts, graphs and maps description
- [ ] Images containing text add alt description

**Headings**
- [ ] Heading components
- [ ] One h1 on each page
- [ ] Logical sequence

**List**
- [ ] list elements (ol, ul  and dl)

**Controls**
- [ ] a for links
- [ ] recognisable links
- [ ] controls have :focus states
- [ ] button elements for buttons
- [ ] skip link
- [ ] communicate well when opening a new tab/window

**Tables**
- [ ] table elements
- [ ] use th (table header)
- [ ] caption element

**Forms**
- [ ] all inputs are provided with label
- [ ] fieldset/legend elements
- [ ] autocomplete option
- [ ] form errors are displayed
- [ ] error/succes/empty not displayed only by color

**Media**
- [ ] disable autoplay
- [ ] use type within inputs
- [ ] media can be paused by space

**Video**
- [ ] Captions included
- [ ] avoid flashing and stobbing animations 

**Audio**
- [ ] Confirm transpscripts are available 

**Appearance**
- [ ] Check High contrast mode
- [ ] text size 200%
- [ ] Ensure proximity between elements
- [ ] Links should have a good contrast
- [ ] combination of characteristics

**Animations**
- [ ] avoid flash animation
- [ ] provide pause function on background video
- [ ] prefers reduced motion

**Color Contrast**
- [ ] Color contrast normal texts
- [ ] Color contrast large texts
- [ ] Color contrast icons
- [ ] borders
- [ ] No text overlapping image/video
- [ ] selection colors

**Mobile and touch**
- [ ] Rotation check
- [ ] Avoid horizontal scrolling
- [ ] Make icons available by ease
- [ ] Make space between scroll and interactive area

## Screen reader test
Use the tool on chrome to make sure it will read every element correctly on the page.

## Performance test
Run a lighthouse test and select performance and paste the results as screenshots In this section. After you improve the code move on to the next section.

Go after the checklist of this[ article.](https://crystallize.com/blog/frontend-performance-checklist)

## Browser test

- [ ] Google Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Polypane



