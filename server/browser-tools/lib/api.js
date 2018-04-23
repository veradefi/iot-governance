/** Copyright (c) 2013 Toby Jaffey <toby@1248.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var express = require('express'),
    config = require('./config'),
    path = require('path'),
    http = require('http'),
    fs = require('fs'),
    https = require('https'),
    fetcher = require('./fetcher');
    dir = require('./dir');

var express_options = {
};

var app = express();

app.set('view engine', 'ejs');

function get_nav() {
    var nav_menu = [
      {
        href: 'pool.html',
        name: 'Smart Pool Key',
        selected: false,
      },
      {
        href: 'key.html',
        name: 'Smart Key',
        selected: false,
      },
      {
        href: 'browser.html',
        name: 'Browser & Editor',
        selected: false,
      },
      {
        href: 'explorer.html',
        name: 'Explorer',
        selected: false,
      },
      {
        href: 'crawler.html',
        name: 'Crawler',
        selected: false,
      },
      {
        href: 'map.html',
        name: 'Map',
        selected: false,
      }
    ]    
    return nav_menu;
}

app.get('/', (req, res) => {
  var render_nav=get_nav();
  render_nav[1]['selected']=true;
  res.render('key', { nav:render_nav, config:config })
})


app.get('/icatOS', (req, res) => {
  res.redirect('/icatOS/');
})

app.get('/index.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[1]['selected']=true;
  res.render('key', { nav:render_nav, config:config })
})

app.get('/pool', (req, res) => {
  var render_nav=get_nav();
  render_nav[0]['selected']=true;
  res.render('pool', { nav:render_nav, config:config })
})

app.get('/pool.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[0]['selected']=true;
  res.render('pool', { nav:render_nav, config:config })
})

app.get('/key', (req, res) => {
  var render_nav=get_nav();
  render_nav[1]['selected']=true;
  res.render('key', { nav:render_nav, config:config })
})

app.get('/key.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[1]['selected']=true;
  res.render('key', { nav:render_nav, config:config })
})

app.get('/browser', (req, res) => {
  var render_nav=get_nav();
  render_nav[2]['selected']=true;
  res.render('browser', { nav:render_nav, config:config })
})

app.get('/browser.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[2]['selected']=true;
  res.render('browser', { nav:render_nav, config:config })
})

app.get('/explorer', (req, res) => {
  var render_nav=get_nav();
  render_nav[3]['selected']=true;
  res.render('explorer', { nav:render_nav, config:config })
})

app.get('/explorer.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[3]['selected']=true;
  res.render('explorer', { nav:render_nav, config:config })
})

app.get('/crawler', (req, res) => {
  var render_nav=get_nav();
  render_nav[4]['selected']=true;
  res.render('crawler', { nav:render_nav, config:config })
})

app.get('/crawler.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[4]['selected']=true;
  res.render('crawler', { nav:render_nav, config:config })
})

app.get('/map', (req, res) => {
  var render_nav=get_nav();
  render_nav[5]['selected']=true;
  res.render('map', { nav:render_nav, config:config })
})

app.get('/map.html', (req, res) => {
  var render_nav=get_nav();
  render_nav[5]['selected']=true;
  res.render('map', { nav:render_nav, config:config })
})

app.configure(function () {
    app.set('port', config.port);
    app.use(express.logger('dev'));
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, config.htdocs), {index:'/'})),
    app.use(express.directory(path.join(__dirname, config.htdocs)));
});

app.get('/fetch', fetcher.fetch);           // web proxy
app.post('/post', fetcher.post);           // web proxy
app.del('/del', fetcher.del);           // web proxy

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

