.. _api-label:

Hypercat API
**************************************************

******************************************************************
The Universal IoT Blockchain Database Hypercat API
******************************************************************

The primary entities indexed by IotBlock are individual IoT Device API URL that exist
somewhere out in the world, and that typically publish one or more sensor feeds
containing data recorded from that specific physical location.

Typically you will use the IotBlock Hypercat Catalogue to search for API out there matching
some search criteria you have, however you can also use the Universal Iot Blockchain Database to
request data for a Hypercat (PAS212:2016) IoT Device you already know the identifier of.

******************************************************************
Search API
******************************************************************

.. http:get:: /cat

   Search for things indexed by IotBlock. If you make a request without
   specifying any query parameters you will receive a **400 Bad Request**
   response, as the IotBlock API currently requires you to specify some
   criteria when searching the API.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/?rel=urn:X-hypercat:rels:healthStatus&val=Provisioning HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Access-Control-Allow-Origin: *
      Content-Type: application/vnd.api+json

      {
        "catalogue-metadata": [
            {
                "rel": "urn:Xhypercat:rels:supportsSearch", 
                "val": "urn:X-hypercat:search:simple"
            }, 
            {
                "rel": "urn:X-space:rels:launchDate", 
                "val": "2018-04-24"
            }, 
            {
                "rel": "urn:X-hypercat:rels:lastUpdated", 
                "val": "2018-04-241T11:23:27Z"
            }, 
            {
                "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                "val": "51.508775"
            }, 
            {
                "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                "val": "-0.116993"
            }, 
            {
                "rel": "urn:X-hypercat:rels:isContentType", 
                "val": "application/vnd.hypercat.catalogue+json"
            }, 
            {
                "rel": "urn:X-hypercat:rels:hasDescription:en", 
                "val": ""
            }, 
            {
                "rel": "urn:X-hypercat:rels:health", 
                "val": "0"
            }, 
            {
                "rel": "urn:X-hypercat:rels:healthStatus", 
                "val": "Provisioning"
            }
        ], 
        "items": []
    }

   :query rel: full text search string to only return things that match the given query.
   :query val: full text search string to only return things that match the given query.
   :query geobound-minlong: numerical value representing the minimum longitude of a bounding box allowing clients to request things within a specific geographical area.
   :query geobound-minlat: numerical value representing the minimum latitude of a bounding box allowing clients to request things within a specific geographical area.
   :query geobound-maxlong: numerical value representing the maximum longitude of a bounding box allowing clients to request things within a specific geographical area.
   :query geobound-maxlat: numerical value representing the maximum latitude of a bounding box allowing clients to request things within a specific geographical area.
   :query geo-long: numerical value representing the longitude coordinate of geographic point allowing clients to request things within a specific geographical area.
   :query geo-lat: numerical value representing the latitude coordinate of a geographic point allowing clients to request things within a specific geographical area.
   :query geo-radius: numerical value representing radius in meters allowing clients to request things within a specific geographical area.
   :query sort: parameter that specifies how results are sorted. Permitted values are ``score`` or ``distance``. Default value is ``score`` meaning results are returned in order of _best_ to _worst_. Each value can also be negated by prefixing with a **-**, i.e. ``-distance``.
   :query limit: numerical value indicating how many results should be returned in each response. Default value is 50.
   :query starting-after: string parameter used when paginating to navigate to the next page of results. The value of this parameter is calculated on the server, so clients should not expect to be able to infer the value for this parameter, rather they **must** just use the *next* link returned by the server.
   :query starting-before: string parameter used when paginating to navigate to the previous page of results. The value of this parameter is calculated on the server so clients should not expect to be able to infer the value of this parameter, rather they **must** just use the *previous* link returned by the server.
   :>jsonarr type: JSON API requires all resource documents to specify a type, all things return a type of ``thing``.
   :>jsonarr id: The UID of the Hypercat (PAS212:2016) IoT Device
   :>jsonarr attributes: A JSON object containing the attributes of the Hypercat (PAS212:2016) IoT Device described below.
   :>json title: The title of the Hypercat (PAS212:2016) IoT Device
   :>json description: The description of the Hypercat (PAS212:2016) IoT Device (may be null).
   :status 200: response was handled successfully
   :status 400: client error - either a request with no parameters was made, or an invalid parameter combination was submitted.
   :status 500: internal server error

******************************************************************
GET /cat/get
******************************************************************

.. http:get:: https://iotblock.io/cat/get?href=:href

   Get a hypercat catalogue with URL `href`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/get?href=https://iotblock.io/cat HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Access-Control-Allow-Origin: *
      Content-Type: application/vnd.api+json

      {
        "catalogue-metadata": [
            {
                "rel": "urn:Xhypercat:rels:supportsSearch", 
                "val": "urn:X-hypercat:search:simple"
            }, 
            {
                "rel": "urn:X-space:rels:launchDate", 
                "val": "2018-04-24"
            }, 
            {
                "rel": "urn:X-hypercat:rels:lastUpdated", 
                "val": "2018-04-241T11:23:27Z"
            }, 
            {
                "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                "val": "51.508775"
            }, 
            {
                "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                "val": "-0.116993"
            }, 
            {
                "rel": "urn:X-hypercat:rels:isContentType", 
                "val": "application/vnd.hypercat.catalogue+json"
            }, 
            {
                "rel": "urn:X-hypercat:rels:hasDescription:en", 
                "val": ""
            }
        ], 
        "items": [
            {
                "href": "https://iotblock.io/cat/brand", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:24:58Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:isContentType", 
                        "val": "application/vnd.hypercat.catalogue+json"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:hasDescription:en", 
                        "val": ""
                    }
                ]
            }, 
            {
                "href": "https://iotblock.io/cat/brand/iotblock", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:26:39Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:isContentType", 
                        "val": "application/vnd.hypercat.catalogue+json"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:hasDescription:en", 
                        "val": ""
                    }
                ]
            }, 
            {
                "href": "https://iotblock.io/cat/location", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:28:40Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:isContentType", 
                        "val": "application/vnd.hypercat.catalogue+json"
                    }
                ]
            }, 
            {
                "href": "https://iotblock.io/cat/location/earth", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:30:11Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:isContentType", 
                        "val": "application/vnd.hypercat.catalogue+json"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:hasDescription:en", 
                        "val": ""
                    }
                ]
            }, 
            {
                "href": "https://iotblock.io/cat/location/earth/singapore", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:31:52Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:isContentType", 
                        "val": "application/vnd.hypercat.catalogue+json"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:hasDescription:en", 
                        "val": ""
                    }
                ]
            }, 
            {
                "href": "https://iotblock.io/cat/location/earth/singapore/changee", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:33:24Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:isContentType", 
                        "val": "application/vnd.hypercat.catalogue+json"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:hasDescription:en", 
                        "val": ""
                    }
                ]
            }, 
            {
                "href": "https://iotblock.io/cat/location/earth/singapore/changee/airport", 
                "item-metadata": [
                    {
                        "rel": "urn:Xhypercat:rels:supportsSearch", 
                        "val": "urn:X-hypercat:search:simple"
                    }, 
                    {
                        "rel": "urn:X-space:rels:launchDate", 
                        "val": "2018-04-24"
                    }, 
                    {
                        "rel": "urn:X-hypercat:rels:lastUpdated", 
                        "val": "2018-04-241T11:34:55Z"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", 
                        "val": "51.508775"
                    }, 
                    {
                        "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long", 
                        "val": "-0.116993"
                    }
                ]
            }
        ]
    }
     
   :param string href: the URL of the resource.
   :query tag: if you pass an optional tag parameter you can restrict the channels returned to just those containing this tag.
   :resheader Access-Control-Allow-Origin: CORS header indicating that the API resource is available without origin restrictions.
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error
   
******************************************************************
GET /cat/setHealth
******************************************************************

.. http:get:: /cat/setHealth

   Update health integrity of a device with URL `href` with Health `health`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/setHealth?url=http://iotdevice.url&health=1 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Access-Control-Allow-Origin: *
      Content-Type: application/vnd.api+json

      {
        "address": "0xa6d786355aebe89997b214c9eb653b37ca23dac5", 
        "balance": 1000000000000000, 
        "eth_recv": 2050000000000000, 
        "health": 1, 
        "isOwner": false, 
        "state": 1, 
        "tokens": 2050000000000000, 
        "vault": "0xa6D786355aEbE89997b214c9Eb653B37cA23daC5"
      }

   :param string id: the unique IotBlock id of the resource.
   :query tag: if you pass an optional tag parameter you can restrict the channels returned to just those containing this tag.
   :resheader Access-Control-Allow-Origin: CORS header indicating that the API resource is available without origin restrictions.
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error

******************************************************************
Catalogues
******************************************************************

Catalogue is the term used to describe the logical or organisational unit
responsible for a particular collection of networked devices. Typically this
will be a data infrastructure provider or a company with a batch of devices
that use a specific data infrastructure. Catalogues may include all open data, a
combination of open and closed data, or be entirely closed.

Access to this endpoint always require authentication.

Get Catalogue
==================================================================

.. http:get:: /cat/:id

   Get a single provider with identifier `id`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/airqualitynetwork HTTP/1.1
      Host: iotblock.io
      Authorization: dGVzdCBzdHJpbmcgMTIzIHRlc3Qgc3RyaW5nIDEyMyB0ZXN0IHN0cmlu...

   **Example Response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Access-Control-Allow-Origin: *
      Content-Type: application/vnd.api+json

      {
        "data": {
          "type": "provider",
          "id": "airqualitynetwork",
          "attributes": {
            "name": "Air Quality Network",
            "description": "Global network of air quality data",
            "website": "http://airqualitynetwork.org",
            "icon_url": null,
            "admin": true
          }
        },
        "links": {
          "self": "https://iotblock.io/v1/cat/airqualitynetwork"
        }
      }

   :param id: provider's unique identifier
   :reqheader Authorization: required authorization credentials supplied either as JWT based ``Bearer`` authentication or as properly encoded HTTP ``Basic`` credentials
   :status 200: request succeeded
   :status 404: resource not found
   :status 403: invalid authorization credentials supplied
