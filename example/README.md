This folder contains an NER example with sentences from the CONLL2003 corpus.

IE-Turk expects the sentences to be tokenized and have each token separated by `>>`. 
The `preprocess.py` scripts shows how to perform this transformation using spacy.

The `config.js` file provides an alternate configuration file to be used for annotation.
We can use it by uncommenting the corresponding line at the bottom of `annotation.html` or by directly replacing the content of the current `config.js`.

We can then start annotating after calling

```
localturk annotation.html example/ner.csv output.csv
```

The `output.csv` is an example output.
