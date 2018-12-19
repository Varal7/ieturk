# IE-Turk: Annotation tool for Information Extraction with localturk / Amazon Mechanical Turk

## Annotate

### Annotate using Mechanical Turk

- Create an new project in [Amazon Mturk interface](https://requester.mturk.com/create/projects/new).
- Paste the content of `annotate.html` in the second tab `Design layout`.
- Insert the scripts `config.js`, `annotate.js` and the CSS file `style.css` into the document as well
- Prepare a tokenized version of the entry, splitting characters with `>>`.
- Submit batch

### Annotate locally

Requires [localturk](https://github.com/danvk/localturk). Install using

```
npm install -g localturk
```

Modify `config.js` with the name of the fields of interest.
Then simply run it using the same tokenized csv file as for Mechanical Turk.

```
localturk annotation.html input.csv output.csv
```

![Screenshot](https://raw.githubusercontent.com/Varal7/ieturk/master/images/tagging.gif)

## Visualize

Simply open `visualize.html` with any modern browser.
Then choose the `.csv` that came from either localturk or Mechanical Turk.

![Screenshot](https://raw.githubusercontent.com/Varal7/ieturk/master/images/viz.png)

This file is also served at [Visualization Demo](http://people.csail.mit.edu/quach/ieturk-demo/).
You can try uploading this [CSV file](https://raw.githubusercontent.com/Varal7/ieturk/master/example/output.csv).
