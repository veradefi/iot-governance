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

IoTBlock's Universal IoT Blockchain Database Hypercat API can be accessed at <https://iotblock.io/cat>


******************************************************************
User API
******************************************************************

User is the term used to describe the logical or organisational unit accessing the Catalogue. Each User has a Smart Key, which is used to authenticate the user, transfer ETH, and to store ETH.

Access to this endpoint always require authentication.


Get Smart Key of a User
==================================================================
   
.. http:get:: /cat/getSmartKey?address=:address

   Each User has a unique Smart Key, which can be accessed by specifying the Ethereum Address `:address` of the user
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/getSmartKey?address=0xa6d786355aebe89997b214c9eb653b37ca23dac5 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

       {
        "address": "0xa59eedac3ec4570a54d9f65caa5fbf4f4893bd40", 
        "balance": 1999800000000000000, 
        "eth_recv": 2000400000000000000, 
        "health": 1, 
        "isOwner": true, 
        "state": 1, 
        "tokens": 2000000000000000000, 
        "vault": "0xa6D786355aEbE89997b214c9Eb653B37cA23daC5"
       }

   :param string address: the Ethereum Address of the User
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error
   


Get Smart Key Transactions History of a User
==================================================================

.. http:get:: /cat/getSmartKeyTx?address=:address&offset=:offset&limit=:limit

   Returns Smart Key Transactions made by the user with Ethereum Address `:address` returning `:limit` number of transactions starting from offset `:offset` in time descending order
   
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/getSmartKeyTx?address=0xa6d786355aebe89997b214c9eb653b37ca23dac5 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

       {
        "count": 12, 
        "offset": 0, 
        "transactions": [
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524660424, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524660229, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616673, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616673, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616628, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616628, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 1
            }
        ]
       }

   :param string address: the Ethereum Address of the User
   :param integer limit: the limit of number of transactions to return. If no limit is specified, last 10 transactions are returned
   :param offset: the offset of the starting point of transactions record
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error
   
   
   
Transfer ETH from Smart Key
==================================================================

.. http:post:: /cat/transferUserEth?address=:address&beneficiary=:beneficiary&amount=:amount

   Transfer `:amount` Wei (of ETH) stored in the Smart Key of the user with address `:address` to beneficiary `:beneficiary`.
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/transferUserEth?address=0xa6d786355aebe89997b214c9eb653b37ca23dac5&amount=100000&beneficiary=0xc486d321F02FD3AdFd800A1b4d365f8295847f97 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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

   :param string address: the Ethereum Address of the user
   :param string beneficiary: Ethereum Address of the beneficiary
   :param integer amount: the amount of Wei (of ETH) to transfer
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error


   
Update User Smart Key Device Integrity Status
==================================================================

.. http:post:: /cat/setUserHealth?address=:address&health=:health

   Update Smart Key Device Health integrity of a user with Ethereum Address `:address` with Health `:health`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/setUserHealth?health=1&address=0xa6d786355aebe89997b214c9eb653b37ca23dac5 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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

   :param string address: the Ethereum Address of the user
   :param integer health: the Device Integrity status of the resource
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error

Device Integrity Status Codes
------------------------------------------------------------------

.. code-block:: json

    [
     { "health":0, "healthStatus":"Provisioning"}, 
     { "health":1, "healthStatus":"Certified"}, 
     { "health":2, "healthStatus":"Modified"}, 
     { "health":3, "healthStatus":"Compromised"}, 
     { "health":4, "healthStatus":"Malfunctioning"}, 
     { "health":5, "healthStatus":"Harmful"}, 
     { "health":6, "healthStatus":"Counterfeit"}
    ]
    


******************************************************************
Catalogue API
******************************************************************

Catalogue is the term used to describe the logical or organisational unit
responsible for a particular collection of networked devices. Typically this
will be a data infrastructure provider or a company with a batch of devices
that use a specific data infrastructure.

Access to this endpoint always require authentication.


   
Get a Local Catalogue
==================================================================

.. http:get:: /cat/:id

   Get a single provider with identifier `id`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/brand HTTP/1.1
      Host: iotblock.io
      Authorization: dGVzdCBzdHJpbmcgMTIzIHRlc3Qgc3RyaW5nIDEyMyB0ZXN0IHN0cmlu...

   **Example Response**:

   .. sourcecode:: json

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
        ], 
        "items": [
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
            }
        ]
    }

   :param id: provider's unique identifier
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: request succeeded
   :status 404: resource not found
   :status 403: invalid authorization credentials supplied


Get a Catalogue by URL
==================================================================

.. http:get:: /cat/get?href=:href

   Get a hypercat catalogue with URL `href`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/get?href=https://iotblock.io/cat HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error



Add a New Catalogue 
==================================================================

.. http:post:: /cat/post?href=:href&parent_href=:parent_href

   Add a hypercat catalogue node with URL `:href` to hypercat catalogue node `:parent_href`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/post?parent_href=https://iotblock.io/cat/brand&href=https://iotblock.io/cat/brand/iotgov HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

      { 
          "healthStatus" : "Provisioning" 
      }
      
      
   :param string parent_href: the URL of the parent resource.
   :param string href: the URL of the resource to add.
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error

Add a Meta Data to a Catalogue
==================================================================

.. http:post:: /cat/postNodeMetaData?href=:href&rel=:rel&val=:val

   Add a Meta Data with Relationship ':rel' equal to Value ':val' to hypercat catalogue node with URL `:href`
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/postNodeMetaData?href=https://iotblock.io/cat/brand/iotcat&rel=urn:X-hypercat:rels:isContentType&val=application/vnd.hypercat.catalogue+json HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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
        ], 
        "items": []
       }
      
      
   :param string href: the URL of the resource 
   :param string rel: the Relationship of Meta Data
   :param string val: the Value of Meta Data   
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error


Update Catalogue Device Integrity Status
==================================================================

.. http:post:: /cat/setHealth?url=:url&health=:health

   Update health integrity of a device with URL `href` with Health `health`.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/setHealth?url=http://iotdevice.url&health=1 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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

   :param string url: the URL of the resource.
   :param integer health: the Device Integrity status of the resource
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error

Device Integrity Status Codes
------------------------------------------------------------------

.. code-block:: json

    [
     { "health":0, "healthStatus":"Provisioning"}, 
     { "health":1, "healthStatus":"Certified"}, 
     { "health":2, "healthStatus":"Modified"}, 
     { "health":3, "healthStatus":"Compromised"}, 
     { "health":4, "healthStatus":"Malfunctioning"}, 
     { "health":5, "healthStatus":"Harmful"}, 
     { "health":6, "healthStatus":"Counterfeit"}
    ]
    


Get Smart Key of a Catalogue
==================================================================
   
.. http:get:: /cat/getNodeSmartKey?href=:href

   Each Catalogue Node has a unique Smart Key, which can be accessed by specifying the URL `:href` of the node 
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/getNodeSmartKey?href=https://iotblock.io/cat/brand/iotblock HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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

   :param string href: the URL of the Catalgoue 
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error
   


Get Smart Key Transactions History of a Catalogue
==================================================================

.. http:get:: /cat/getNodeSmartKeyTx?href=:href&offset=:offset&limit=:limit

   Returns Smart Key Transactions made within the specified catalgoue with URL `:href` returning `:limit` number of transactions starting from offset `:offset` in time descending order
   
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/getNodeSmartKey?href=https://iotblock.io/cat/brand/iotblock HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

      {
        "count": 12, 
        "offset": 0, 
        "transactions": [
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524660424, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524660229, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616673, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616673, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616628, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616628, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 1
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 0
            }, 
            {
                "account": "0x1Bcb2F4f575c4Ef2AFBC758f16643E4481E2481A", 
                "amount": 100000000000000, 
                "date": 1524616013, 
                "tx_type": 1
            }
        ]
    }

   :param string href: the URL of the Catalgoue 
   :param integer limit: the limit of number of transactions to return. If no limit is specified, last 10 transactions are returned
   :param offset: the offset of the starting point of transactions record
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error
   
   
   
Transfer ETH from Catalogue
==================================================================

.. http:post:: /cat/transferNodeEth?href=:href&beneficiary=:beneficiary&amount=:amount

   Transfer `:amount` Wei (of ETH) stored in the Node `:href` to beneficiary `:beneficiary`.
   
   **Example Request**:

   .. sourcecode:: http

      GET /cat/transferNodeEth?href=https://iotblock.io/cat/brand/iotblock&amount=100000&beneficiary=0xc486d321F02FD3AdFd800A1b4d365f8295847f97 HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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

   :param string href: the URL of the Node storing the ETH
   :param string beneficiary: Ethereum Address of the beneficiary
   :param integer amount: the amount of Wei (of ETH) to transfer
   :reqheader Authorization: required Smart Key API Token supplied as authentication credentials
   :status 200: response was handled successfully.
   :status 404: IotBlock was unable to find the specified resource.
   :status 500: Internal server error

Search a Catalogue
==================================================================

.. http:get:: /cat?rel=:rel&val=:val

   Search for things indexed by IotBlock. If you make a request without
   specifying any query parameters you will receive all catalogue items stored in the specified catalogue.

   **Example Request**:

   .. sourcecode:: http

      GET /cat/?rel=urn:X-hypercat:rels:healthStatus&val=Provisioning HTTP/1.1
      Host: iotblock.io
      Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   **Example Response**:

   .. sourcecode:: json

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

    :query rel: full text search string to only return Catalogues that match the given query.
    :query val: full text search string to only return Catalogues that match the given query.
    :prefix­rel: Any metadata relation URI as a JSON string
    :prefix­val: Any metadata value URI as a JSON string
    :prefix­href: A resource URI URI as a JSON string
    :lexrange-­rel: Specifies the ​rel ​to search on (e.g. urn:X­hypercat:rels:lastUpdated)
    :lexrange-­min: Lower bound of range to return (inclusive) (e.g. 2007­03­01T13:00:00Z)
    :lexrange-­max: Upper bound of range to return (non­inclusive) (e.g. 2007­04­02T12:07:41Z)
    :geobound-minlong: numerical value representing the minimum longitude of a bounding box allowing clients to request things within a specific geographical area.
    :geobound-minlat: numerical value representing the minimum latitude of a bounding box allowing clients to request things within a specific geographical area.
    :geobound-maxlong: numerical value representing the maximum longitude of a bounding box allowing clients to request things within a specific geographical area.
    :geobound-maxlat: numerical value representing the maximum latitude of a bounding box allowing clients to request things within a specific geographical area.
    :>jsonarr type: JSON API requires all resource documents to specify a type, all things return a type of ``thing``.
    :>jsonarr id: The UID of the Hypercat (PAS212:2016) IoT Device
    :>jsonarr attributes: A JSON object containing the attributes of the Hypercat (PAS212:2016) IoT Device described below.
    :>json title: The title of the Hypercat (PAS212:2016) IoT Device
    :>json description: The description of the Hypercat (PAS212:2016) IoT Device (may be null).
    :status 200: response was handled successfully
    :status 400: client error - either a request with no parameters was made, or an invalid parameter combination was submitted.
    :status 500: internal server error
    