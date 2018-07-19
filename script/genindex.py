#!/usr/bin/python

import os
import sys
import json
import argparse
import pprint
from jinja2 import Template

pp = pprint.PrettyPrinter(indent=4)

def main():

    parser = argparse.ArgumentParser(description='Generate the HTML index page')
    parser.add_argument("json", help="The class_data.json file")
    parser.add_argument("in_html", help="The input HTML template")
    parser.add_argument("out_html", help="The output HTML file")
    args = parser.parse_args()

    html = ""
    class_count = 0

    with open(args.json) as json_file:
        data = json.load(json_file)
        
        for group in data["groups"]:
            zipLink = group["id"] + '/' + group["id"] + '.zip'

            html += ' <div class="row f5-group">\n' +\
                    '  <div class="col-md-12">\n' +\
                    '   <a class="f5-group-name" href="' + group["id"] + '/html/index.html">' + group["name"] + '</a><br>\n' +\
                    '   <font class="f5-group-description">' + group["description"] + '</font>\n' +\
                    '  </div>'

            for clas in group["classes"]:
                class_count += 1
                if "htmllink" not in clas:
                    htmlLink = group["id"] + '/html/index.html'
                    classHtmlLink = group["id"] + '/html/' + clas["id"] + '/' + clas["id"] + '.html'
                else:
                    htmlLink = group["id"] + clas["htmllink"]
                    classHtmlLink = htmlLink

                html += '   <div class="col-md-8 f5-class-item">\n' +\
                        '    <a class="f5-class-item" href="' + classHtmlLink + '">' + clas["name"] + '</a>\n' +\
                        '    <a class="f5-class-download" href="' + zipLink + '">[download]</a>\n' +\
      				    '   </div>\n'

            html += ' </div>'
            #break

    vars = {
        'class_html': html,
        'class_count': class_count
    }

    with open(args.in_html) as inhtml:
        #template = inhtml.read()
        template = Template(inhtml.read())
        inhtml.close()
        
        with open(args.out_html, 'w') as outfile:
        	outfile.write(template.render(vars))


if __name__ == '__main__':
    main()
