Overview
********

Introduction
============

Welcome to The Universal IoT Blockchain Database, the Open Source Ethereum Hypercat Database as a Service.
You can use The Universal IoT Blockchain Database, Hypercat API, and Hypercat Web Interface to search for, store, and retrieve
Device Integrity and Relationship Metadata on the IoT objects information crowdsourced by the community participants like you.

Our Hypercat (PAS212:2016) API is designed to follow standard RESTful design practices featuring
predictable resource-oriented URLs and to use standard HTTP response codes to
indicate errors.

Github Source Code
===================
We encourage participation to contribute to the open-source development efforts of this project, which is available at <https://github.com/iotblock/iotblock>

Accessing the Source Code Repository:

::
    
    git clone https://github.com/iotblock/iotblock
    
    
Transport Protocols
===================

All requests to the IotBlock Hypercat (PAS212:2016) API can currently be made over either ``http`` or
``https``. We strongly recommend using the ``https`` endpoint if your client can
support it, which it almost certainly will. The only clients that might have a
problem with ``https`` would be low powered devices like an Arduino.

Data Protocols
==============

The IotBlock API currently exposes it's data via two protocols: `JSON API
<http://jsonapi.org>`_ and `Hypercat <http://www.hypercat.io>`_.  Both
specifications are basically JSON documents over HTTP, but where they differ is
that Hypercat is very much intended to be a simple discovery mechanism by which
IOT resources can be listed as a first step to making use of these resources,
whereas our full API provides richer capabilities for interacting with the
resources listed.

JSON API
--------

JSON API is a relatively new set of conventions for designing RESTful JSON
based APIs over HTTP. It specifies a minimal set of conventions describing how
data should be structured and made available, which in theory allow developers
to take advantage of generalised tooling for consuming these APIs and allow
them to focus on actually doing something useful with the data.

Full details of the specification are available on the JSON API website here:
http://jsonapi.org/format/.

Hypercat
--------

Hypercat is a JSON based hypermedia catalogue format designed for exposing
information about IoT assets over the web. It was conceived and is now
supported by a large consortium of significant players in the Internet of
Things (IoT) industry, and its stated goal is to promote interoperability
between disparate vendors and service providers.

The latest version of the standard can be found here:
http://www.hypercat.io/standard.html, but for more details on how we are
implementing Hypercat please see our :ref:`hypercat-label` implementation.

Authentication
==============

Not every request to the IotBlock API requires authentication; for example
simple search requests for API or requests for the IotBlock Hypercat can be
made without providing any credentials. However for endpoints where access
requires specific permissions authentication credentials can be sent via API Token generated from Smart Key:

* Smart Key Creation Web Interface URL:  ``https://iotblock.io/icatOS/key.html``

Some requests that require authentication will return ``404 Not Found`` instead of
``403 Forbidden`` where returning a ``403 Forbidden`` might leak information on
private resources to unauthorised clients.

Smart Key API Token (sent as a header)
---------------------------------

You can make authenticated requests by sending API Key in the ``Authorization``
header::

  curl -H "Authorization: dGVzdCBzdHJpbmc..." "https://iotblock.io/cat/"

Smart Key API Token can be obtained via ``https://iotblock.io/icatOS/key.html``

Schema & Date Format
====================

The IotBlock API returns all requested data as JSON, including error messages.

Blank fields in response bodies will be always included, and will be returned
with a value of ``null`` if they are a simple value. If they are an array type
they will be represented as the empty array: ``[]``, or if they represent a
nested JSON object they will be an empty object: ``{}``.

All timestamps will be returned in the standard ISO8601 format including
milliseconds, e.g. ``YYYY-MM-DDTHH:MM:SS.sssZ``

Root Endpoint
=============

You may issue a ``GET`` request to the root endpoint of the API to receive a
JSON body containing all of the endpoints supported via the API. This is
intended to make the API as intuitive and 'explorable' as possible for users
wishing to build something using the API.

.. sourcecode:: bash

   $ curl https://iotblock.io/cat

HTTP Status Codes
=================

The IotBlock API attempts to use standard HTTP status codes. In general
responses in the **2xx** range indicate success, codes in the **4xx** range
indicate an error on the client side (e.g. missing or incorrect parameters or
invalid request bodies), and codes in the **5xx** range indicate an error in
the IotBlock servers.

============================= ==============================================================
Response Code                 Meaning
============================= ==============================================================
``200 OK``                    Request succeeded, response is included
``204 No Content``            Request succeeded, no response body has been sent
``400 Bad Request``           Client error, often a missing or incorrect parameter
``404 Not Found``             Server unable to locate specified resource
``422 Unprocessable Entity``  Client error, often a malformed JSON body
``500 Internal Server Error`` Some unexpected error happened in the IotBlock server stack
``502 Bad Gateway``           One or more of the services IotBlock depends on is unavailable
``503 Service Unavailable``   The main IotBlock API server is temporarily down
============================= ==============================================================

Errors
======

In general the IotBlock API attempts to return HTTP status codes that correlate
with any errors, but to aid debugging for **4xx** errors where the client can
reasonably expect that an amendment to their request might resolve the problem,
we also return a JSON body containing some additional information about the
problem.

An example error response might look like this:

.. sourcecode:: http

   HTTP/1.1 400 Bad Request
   Content-Length: 200
   Content-Type: application/vnd.api+json

   {
     "errors": [
       {
         "status": "400",
         "title": "Invalid query parameter",
         "detail": "Value must be less than 500"
         "source": {
           "parameter": "limit"
         }
       }
     ]
   }

Pagination
==========

Resources that return multiple items will be paginated to 50 items by default.
Larger or smaller page sizes can be requested by sending a ``limit`` parameter
where the maximum limit possible is ``500``.

The pagination supported by IotBlock is a *cursor* style pagination
implementation where any requests made to the API that return content that
might be paginated will include in the response body links to allow the client
to navigate through the complete data set by requesting subsequent pages.

Further details on this are given in the individual sections for
:ref:`api-label` and :ref:`hypercat-label`.

Time Zones
==========

Currently the IotBlock API returns all timestamps in UTC.

Cross Origin Resource Sharing (CORS)
====================================

The IotBlock API supports simple CORS as every response currently includes the
required ``Access-Control-Allow-Origin: *`` header which means that **any
resource** can be accessed by **any domain** in a cross-site manner

Content Types
=============

All content published by the IotBlock API will have one of two content types:

``application/vnd.api+json``
    This is the standard content type mandated for server implementations that
    conform to the JSON API standard.

``application/vnd.hypercat.catalogue+json``
    This content type is required MIME type for Hypercat documents, and will be
    returned for all clients interacting with our Hypercat endpoint.

Both of the above mime types describe a JSON document format.

.. rubric:: Footnotes

.. [#f1] cURL or curl is an open source command line tool and library for
     transferring data across the network. It supports a huge range of
     protocols, but we're just using it as a tool for making HTTP requests from
     the command line. If you have an OSX or Linux machine you probably already
     have curl installed on your system, windows users will have to work harder
     to install it. See: http://curl.haxx.se/
