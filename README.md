# Information extraction with localturk / Amazon Mechanical Turk

## Annotate

### Annotate using Mechanical Turk

- Create an new project in [Amazon Mturk interface](https://requester.mturk.com/create/projects/new).
- Paste the content of `annotate.html` in the second tab `Design layout`.
- Insert the scripts `utils.js`, `annotate.js` and the CSS file `style.css` into the document as well
- Prepare a tokenized version of the entry, splitting characters with `>>`.
- Submit batch

### Annotate locally

Requires [localturk](https://github.com/danvk/localturk). Install using

```
npm install -g localturk
```

```
localturk annotation.html input.csv output.csv
```

![Screenshot](https://raw.githubusercontent.com/Varal7/ieturk/master/tagging.gif)

## Visualize

Simply open `visualize.html` with any modern browser.
