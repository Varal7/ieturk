import csv
import spacy

nlp = spacy.load('en')

csvin = csv.reader(open("raw.csv"))
csvout = csv.writer(open("input.csv", 'w'))
next(csvin)
for row in csvin:
    doc = nlp(row[1])
    out_row = [ row[0], ">>".join([t.text for t in doc])]
    csvout.writerow(out_row)
