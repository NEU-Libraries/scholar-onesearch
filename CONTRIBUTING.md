How to contribute
=================

## Report an issue

During our testing we will need to try tracking the issues that are found. It would be impossible for me, Steven, to find all of them, so this is where I need your help.

#### Rules

* Check for duplicate issues first.
  * If there is a duplicate issue, add a comment to that.
* Don't assign me issues, I will take care of assigning it to the right people.
* For this initial launch, use the *v1.0.0* milestone.
* Apply labels:
  * Critical Importance
     * Unable to use.
  * Medium Importance
     * Difficult to use. Looks really bad and doesn't look like the rest of the design.
  * Low Importance
     * Worth fixing, but not going to block a user from using the product.
  * etc. don't be afraid to add new labels, but look at which ones already make sense.

#### Markdown template

Copy and paste this into the issue body. Note you can add the screenshot by dragging, pasting or uploading the image into the body.
- - -

     * Screenshot: ![screnshot](http://ge.tt/api/1/files/51erV3i/0/blob?download)
     * URL: http://www.example.com
     * Browser: Chrome 27 on Mac
     * Description: I was trying to use the facets on the page



#### Turns into.
- - -


* Screenshot: ![screnshot](http://ge.tt/api/1/files/51erV3i/0/blob?download)
* URL: http://www.example.com
* Browser: Chrome 27 on Mac
* Description: I was trying to use the facets on the page

- - -
#### How to get these:

* [Hot to take a screenshot](http://www.take-a-screenshot.org/)
* [Find my browser information through javascript](http://www.quirksmode.org/js/detect.html)
* 

- - -
## Feature Request

Please use the issue queue to purpose new features for this project, but please use these guidelines.


## Pull Request


### LESS Structure

```
less/
  |-base/
  |-components/
  |-legacy/
  |-library/
  |-sections/
  |-utilities/
  |-vendor/
  - legacy.less
  - style.less
```
