Overview
********

Introduction
========================================================================

Welcome to The Universal IoT Blockchain Database, the Open Source Ethereum Hypercat Database as a Service.
You can use The Universal IoT Blockchain Database, Hypercat API, and Hypercat Web Interface to search for, store, and retrieve
Device Integrity and Relationship Metadata on the IoT objects information crowdsourced by the community participants like you.

Our Hypercat (PAS212:2016) API is designed to follow standard RESTful design practices featuring
predictable resource-oriented URLs and to use standard HTTP response codes to
indicate errors.

Github Source Code
========================================================================

We encourage participation to contribute to the open-source development efforts of this project, which is available at <https://github.com/iotblock/iotblock>

Accessing the Source Code Repository:

::
    
    git clone https://github.com/iotblock/iotblock
    
    
Transport Protocols
========================================================================

All requests to the IotBlock Hypercat (PAS212:2016) API can currently be made over either ``http`` or
``https``. We strongly recommend using the ``https`` endpoint if your client can
support it, which it almost certainly will. The only clients that might have a
problem with ``https`` would be low powered devices like an Arduino.

Data Protocols
========================================================================

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
========================================================================

Not every request to the IotBlock API requires authentication; for example
simple search requests for API or requests for the IotBlock Hypercat can be
made without providing any credentials. However for endpoints where access
requires specific permissions authentication credentials can be sent via API Token generated from Smart Key:

* Smart Key Creation Web Interface URL:  ``https://iotblock.io/icatOS/key.html``

Some requests that require authentication will return ``404 Not Found`` instead of
``403 Forbidden`` where returning a ``403 Forbidden`` might leak information on
private resources to unauthorised clients.

Smart Key API Token (sent as a header)
------------------------------------------------------------------

You can make authenticated requests by sending API Key in the ``Authorization``
header::

  curl -H "Authorization: dGVzdCBzdHJpbmc..." "https://iotblock.io/cat/"

Smart Key API Token can be obtained via ``https://iotblock.io/icatOS/key.html``


Root Endpoint
========================================================================

You may issue a ``GET`` request to the root endpoint of the API to receive a
JSON body containing all of the endpoints supported via the API. This is
intended to make the API as intuitive and 'explorable' as possible for users
wishing to build something using the API.

.. sourcecode:: bash

   $ curl https://iotblock.io/cat

Further details on this are given in the individual sections for
:ref:`api-label` and :ref:`hypercat-label`.


Smart Contracts
========================================================================
The primary entities storing IotBlock Data in Blockchain are individual Smart Contracts deployed on Ethereum network stored decentrally, collectively called The Universal IoT Blockchain Database.

Typically you will use the Ethereum Client (e.g. Web3) to access the IoTBlock Smart Contracts. Each mutating transaction involves gas and an ETH donation, which are shared between Catalogue Creators and IoTBlock on 50/50 basis.


Web Interface
========================================================================

The Universal IoT Blockchain Database Web Interface provides browser access to IoTBlock Smart Contract and IoTBlock Hypercat API

IoTBlock's Web Interface can be accessed at <https://iotblock.io/icatOS>


