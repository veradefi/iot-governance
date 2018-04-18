Browser Tools
=============

This repository is a collection of browser-based tools and tests for working with the IoT catalogue format known by the MIME type "application/vnd.tsbiot.catalogue+json".

The tools are web applications, written with node.js, using javascript and HTML in the browser.
They may be run on a public server/browser-tools, or locally on a PC, but are always accessed through a browser.

Contents
--------

 * server/browser-tools/ a web server/browser-tools + HTTP proxy serving:
   * server/browser-tools/views/crawler.ejs a browser-based catalogue crawler and knowledge graph viewer
   * server/browser-tools/views/explorer.ejs an interactive browser-based catalogue explorer and knowledge graph viewer
   * server/browser-tools/views/map.ejs a browser-based catalogue mapping demo
   * server/browser-tools/views/browser.ejs a browser-based catalogue text browser demo
   * server/browser-tools/views/validator.ejs a fully browser side catalogue syntax checker

Run the server/browser-tools
--------------

    npm install
    npm start

Browse to a client
------------------

Visit http://localhost:8000/


Why do I need to run the server/browser-tools?
--------------------------------

Almost all of the application code is client-side. The server/browser-tools provides an HTTP proxy (relays GET requests to /cat/get?href=, POST requests on /cat/post?href= and DELETE requests on /del?url=) to work around the cross-domain constraints of Javascript requests.


