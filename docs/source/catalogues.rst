.. _catalogue-label:

Catalogues
*********

Catalogue is the term used to describe the logical or organisational unit
responsible for a particular collection of networked devices. Typically this
will be a data infrastructure provider or a company with a batch of devices
that use a specific data infrastructure. Catalogues may include all open data, a
combination of open and closed data, or be entirely closed.

Access to this endpoint always require authentication.

Get Catalogue
============

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
