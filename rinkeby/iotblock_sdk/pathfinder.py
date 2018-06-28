#!/usr/bin/env python
#
# PATHFINDER_CLIENT.PY
# Copyright (c) 2013 Pilgrim Beart <pilgrim.beart@1248.io>
# 
# Enables easy management of Hypercat catalogues on remote Pathfinder instances
#
##Permission is hereby granted, free of charge, to any person obtaining a copy
##of this software and associated documentation files (the "Software"), to deal
##in the Software without restriction, including without limitation the rights
##to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
##copies of the Software, and to permit persons to whom the Software is
##furnished to do so, subject to the following conditions:
##
##The above copyright notice and this permission notice shall be included in
##all copies or substantial portions of the Software.
##
##THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
##IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
##FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
##AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
##LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
##OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
##THE SOFTWARE.
##
## Usage:
##    Create a Catalogue object
##    Write it to a Pathfinder instance
##    Delete it

import requests
import json
import codecs
import base64
import logging
#import urllib2  # Warning - outside of GAE, this doesn't check HTTPS certs (the better "Requests" alternative module does, but doesn't yet run in GAE)

# Pushes HyperCat catalogues to Pathfinder instances
# Catalogue URLs are arbitrary (i.e. they do not reflect the hierarchy/structure of the catalogue if any -
# Any structure comes solely from the links declared in the catalogues themselves.

# Pathfinder doesn not allow a POST to replace an existing catalogue (it has to be DELETEd first)
# So here we auto-delete on creation, by default
# Pathfinder only accepts catalogue names with characters in the range [A-Za-z0-9]
# Pathfinder generates "409 Conflict" errors for bad names & duplicate names

# TEST_URL = "https://posttestserver.com/post.php"   # Rather useful tool for debugging what we're POSTing!

def getPage(url, key, payload=None, delete=False):
    logging.info("Posting to catalogue "+url+" with key "+str(key)+" and payload "+str(payload)+" and delete "+str(delete))
    # The following approach to constructing Basic Auth should work
    # even if the site doesn't send back a 401 in response to a non-auth request
    response = requests.get(url)
    #authstr = "Basic %s" % base64.encodestring(key+":")[:-1]    # key is passed as username in "username:password". Remove trailing \n
    #request.add_header("Authorization", authstr)
    #request.add_header("Content-Type", "application/json")
    #if(payload):
    #    request.add_data(payload) # automatically changes request-type to POST
    #if(delete):
    #    request.get_method = lambda: 'DELETE'
    #print(response.content);
    return (response.content)


class Catalogue:
    def __init__(self, url, key):
        """Define a new catalogue on a Pathfinder instance"""
        self.key = key
        self.url = url

    def create(self, h, autoDeleteFirst=True):
        """Create a catalogue on this Pathfinder instance"""
        if(autoDeleteFirst):
            try:
                self.delete()
            except:
                pass    # We don't care if the delete fails - probably the catalogue doesn't yet exist
        body = getPage(self.url, self.key, payload=h.asJSONstr())
        assert body=="Created",body[0:20]

    def delete(self):
        """Deletes this catalogue on the Pathfinder instance"""
        body = getPage(self.url, self.key, delete=True)
        assert body=="",body[0:20]

    def get(self):
        """Reads this catalogue entry from the Pathfinder instance"""
        body = getPage(self.url, self.key)
        #logging.info("Body in get was '" +body+"'")
        body=json.loads(body);
        #print(body);
        self.body=body;
        return self.body

    def backup(self, filename):
        with open(filename, 'wb') as f:
            json.dump(self.get(), codecs.getwriter('utf-8')(f),  indent=4, ensure_ascii=False)


### Unit tests ###
    
