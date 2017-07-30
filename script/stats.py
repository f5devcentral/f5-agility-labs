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
	if len(sys.argv)!=3:
		print('command usage: python stats.py <dir to search> <output file>')
		exit(1)
	else:
		dir = sys.argv[1]
		out = sys.argv[2]

	data = { "totalPages":0, "totalWords":0 };

	for filename in glob.iglob('%s/**/*.pdf' % dir, recursive=True):
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
		data["totalPages"] += numPages
		data["totalWords"] += totalWords

	with open(out, 'w') as outfile:
		json.dump(data, outfile, indent=2)


if __name__ == '__main__':
	main()
