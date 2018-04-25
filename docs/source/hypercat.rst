.. _hypercat-label:

Hypercat
********

IotBlock now also exposes information about indexed Things via a Hypercat endpoint.
This endpoint offers similar functionality as the ``/cat`` search endpoint, but
results are returned in Hypercat format.

Hypercat Data Model
===================

The data model for Hypercat is very minimal and simply provides a mechanism for
specifying metadata about resources in the form of RDF-like\ [#f1]_
relation/value pairs (``rel`` and ``val`` in Hypercat parlance), where both
``rel`` and ``val`` are simple string values containing either a URN, which
formally identifies a relation or a value, or any arbitrary application
specific string.  These metadata pairs can be specified either about the
catalogue as a whole (catalogue level metadata), or about each individual
resource listed (resource level metadata).

Within that very minimal framework implementors are free to specify whatever
metadata makes sense for their domain.

Hypercat Metadata
=================

The following list details the Hypercat relations and values currently included
in IotBlock's catalogue.

Hypercat Relations
------------------

``urn:X-hypercat:rels:isContentType``
    Standard Hypercat relation that may be used at either the catalogue or
    resource level. Specifies the content type of the described resource, which
    must have the value ``application/vnd.hypercat.catalogue+json`` at the
    catalogue level, but can be anything when applied to individual resources
    within the catalogue.

``urn:X-hypercat:rels:supportsSearch``
    Standard Hypercat relation intended to be used at the catalogue level.
    Indicates that this catalogue supports some search mechanism. The value
    associated with this key defines the type of search supported.

``urn:X-hypercat:rels:supportsPaging``
    Non-standard Hypercat relation intended to be used at the catalogue level.
    Indicates that this catalogue supports a mechanism for paging through
    results. This mechanism is not currently part of the Hypercat
    specification, but we have drafted an RFC describing our proposed mechanism
    which we hope will be included into future drafts of Hypercat. For details
    of the mechanism please read the RFC (link to follow), but the logic is
    almost exactly the same as the one described in the JSON API specification.

``urn:X-hypercat:rels:previousLink``
    Non-standard Hypercat relation intended to be used at the catalogue level
    when paging through results. If present contains a link to the previous
    page of results, if not present then no previous results are available.

``urn:X-hypercat:rels:nextLink``
    Non-standard Hypercat relation intended to be used at the catalogue level
    when paging through results. If present contains a link to the next page of
    results, if not present then no subsequent results are available.

``urn:X-hypercat:rels:hasPageSize``
    IotBlock specific relation intended to be used at the catalogue level.
    Indicates the page size of the returned catalogue.

``urn:X-hypercat:rels:hasDescription:en``
    Hypercat standard relation that may be used at either the catalogue or
    resource level. Used to contain a human readable description of either an
    individual resource or the catalogue as a whole.

``urn:X-IotBlock:rels:hasDatasource``
    IotBlock specific relation intended to be used at just the resource level.
    A link to the actual source we obtain data from for this resource.

``urn:X-hypercat:rels:hasHomepage``
    Standard Hypercat relation intended to be used at the resource level. A
    link to some human significant representation of the resource.

``urn:X-IotBlock:rels:hasId``
    IotBlock specific relation intended to be used at the resource level. A
    string containing the unique IotBlock identifier of the resource.

``http://www.w3.org/2003/01/geo/wgs84_pos#long``
    Standard Hypercat relation intended to be used at the resource level. The
    longitude value of the location of the resource in the WGS84 reference
    system.

``http://www.w3.org/2003/01/geo/wgs84_pos#lat``
    Standard Hypercat relation intended to be used at the resource level. The
    latitude value of the location of the resource in the WGS84 reference
    system.

``urn:X-IotBlock:rels:hasDataProvider``
    IotBlock specific relation intended to be used at the resource level. A
    link pointing to the upstream data provider of this resource.

``urn:X-IotBlock:rels:hasVisibility``
    IotBlock specific relation intended to be used at the resource level. A
    string indicating whether the listed resource is ``public`` or ``private``.

``urn:X-IotBlock:rels:hasCategory``
    IotBlock specific relation intended to be used at the resource level. A
    string indicating the IotBlock specific category of the resource.

``urn:X-IotBlock:rels:hasOwner``
    IotBlock specific relation intended to be used at the resource level. A
    string containing a reference to an individual that has claimed ownership
    of the resource.

Hypercat Values
---------------

``urn:X-hypercat:search:geobound``
    Standard Hypercat value indicating that a server supports geobound search
    queries. This value must be attached to the
    ``urn:X-hypercat:rels:supportsSearch`` rel to be valid.

``urn:X-IotBlock:search:simple``
    IotBlock specific value indicating that our catalogue supports a simple
    full text search functionality where a ``q`` parameter may be submitted to
    filter the catalogue down to results that contain that query term somewhere
    within their description.

``urn:X-IotBlock:paging:simple``
    IotBlock specific value indicating the type of pagination that the server
    supports. This method of pagination is the one described in the current
    pagination RFC for Hypercat that we hope might see adoption soon.

``urn:X-IotBlock:visibility:public``
    IotBlock specific value indicating that a resource is publicly available.

``urn:X-IotBlock:visibility:private``
    IotBlock specific value indicating that a resource is private. This means
    that gaining access to this data source will require requesting
    authentication.


Get Hypercat
============

.. http:get:: /cat

   Search for cat indexed by IotBlock via Hypercat. If you make a request
   without specifying any query parameters you will receive a **400 Bad
   Request** response, as the IotBlock API currently requires you to specify
   some criteria when querying our catalogue.

   **Example Request**:

   .. sourcecode:: http

      GET /cat?val=pollution HTTP/1.1
      Host: iotblock.io

   **Example Response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Access-Control-Allow-Origin: *
      Content-Type: application/vnd.hypercat.catalogue+json

      {
        "items": [
          {
            "href": "https://iotblock.io/cat/10002qxy",
            "i-object-metadata": [
              {
                "rel": "urn:X-hypercat:rels:hasDescription:en",
                "val": "AQICN Greenwich and Bexley - Falconwood, United Kingdom"
              },
              {
                "rel": "urn:X-hypercat:rels:isContentType",
                "val": "application/json"
              },
              {
                "rel": "urn:X-IotBlock:rels:hasDatasource",
                "val": "http://aqicn.info/json/mapinfo/@7958/info.html"
              },
              {
                "rel": "urn:X-hypercat:rels:hasHomepage",
                "val": "https://IotBlock.net/cat/10002qxy"
              },
              {
                "rel": "urn:X-IotBlock:rels:hasId",
                "val": "10002qxy"
              },
              {
                "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
                "val": "0.085606"
              },
              {
                "rel": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
                "val": "51.4563"
              },
              {
                "rel": "urn:X-IotBlock:rels:hasDataProvider",
                "val": "http://aqicn.info"
              },
              {
                "rel": "urn:X-IotBlock:rels:hasVisibility",
                "val": "public"
              },
              {
                "rel": "urn:X-IotBlock:rels:hasCategory",
                "val": "environment"
              }
            ]
          }
        ],
        "item-metadata": [
          {
            "rel": "urn:X-hypercat:rels:isContentType",
            "val": "application/vnd.hypercat.catalogue+json"
          },
          {
            "rel": "urn:X-hypercat:rels:supportsSearch",
            "val": "urn:X-hypercat:search:geobound"
          },
          {
            "rel": "urn:X-hypercat:rels:supportsSearch",
            "val": "urn:X-IotBlock:search:simple"
          },
          {
            "rel": "urn:X-hypercat:rels:supportsPaging",
            "val": "urn:X-hypercat:paging:simple"
          },
          {
            "rel": "urn:X-hypercat:rels:previousLink",
            "val": "https://iotblock.io/cat?val=pollution&starting_before=1n6ty4sx"
          },
          {
            "rel": "urn:X-hypercat:rels:nextLink",
            "val": "https://iotblock.io/cat?val=pollution&starting_after=1009tyn5"
          },
          {
            "rel": "urn:X-hypercat:rels:hasPageSize",
            "val": "50"
          },
          {
            "rel": "urn:X-hypercat:rels:hasDescription:en",
            "val": "IotBlock Catalog"
          }
        ]
      }

   :query q: full text search string to only return cat that match the given query.
   :query geobound-minlong: numerical value representing the minimum longitude of a bounding box allowing clients to request cat within a specific geographical area.
   :query geobound-minlat: numerical value representing the minimum latitude of a bounding box allowing clients to request cat within a specific geographical area.
   :query geobound-maxlong: numerical value representing the maximum longitude of a bounding box allowing clients to request cat within a specific geographical area.
   :query geobound-maxlat: numerical value representing the maximum latitude of a bounding box allowing clients to request cat within a specific geographical area.

.. rubric:: Footnotes

.. [#f1] RDF information
