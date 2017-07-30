#!/usr/bin/env python3

# Based on: https://github.com/adityashrm21/Pdf-Word-Count

import os
import sys
import re
import time
import PyPDF2
import glob
import json
import argparse
import requests

def getPageCount(pdf_file):

	pdfFileObj = open(pdf_file, 'rb')
	pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
	pages = pdfReader.numPages
	return pages


def extractData(pdf_file, page):

	pdfFileObj = open(pdf_file, 'rb')
	pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
	pageObj = pdfReader.getPage(page)
	data = pageObj.extractText()
	return data


def getWordCount(data):

	data=data.split()
	return len(data)



def main():

	parser = argparse.ArgumentParser(description='Collect stats on the generated docs')
	parser.add_argument("dir", help="The directory to search")
	parser.add_argument("out", help="The JSON output file")
	parser.add_argument("-i", "--incremental", help="Perform and incremental update", action="store_true")
	args = parser.parse_args()

	if args.incremental:
		resp = requests.get(url='http://clouddocs.f5.com/training/community/js/stats.json')
		data = json.loads(resp.text)
		data["totalPages"] = 0;
		data["totalWords"] = 0;
	else:
		data = { "totalPages":0, "totalWords":0 };

	for filename in glob.iglob('%s/**/*.pdf' % args.dir, recursive=True):
		if '-class' in filename:
			continue

		#check if the specified file exists or not
		try:
			os.path.exists(filename)
		except OSError as err:
			print(err.reason)
			exit(1)


		#get the word count in the pdf file
		totalWords = 0
		numPages = getPageCount(filename) - 4
		for i in range(numPages):
			text = extractData(filename, i)
			totalWords+=getWordCount(text)

		print (filename, numPages, totalWords, sep=",", end='\n')

		data[filename.split('/').pop()] = { "words": totalWords, "pages": numPages }

	for pdf in data:
		if '.pdf' in pdf:
			data["totalPages"] += data[pdf]["pages"]
			data["totalWords"] += data[pdf]["words"]

	with open(args.out, 'w') as outfile:
		json.dump(data, outfile, indent=2)


if __name__ == '__main__':
	main()
