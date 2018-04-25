.. _smartkey-label:

Smart Key
*************

The login endpoint is the primary way of creating a token which can be used to
authenticate further accesses to the IoTBlock API.

.. important:: Requests to this endpoint should always use the HTTPS endpoint
   otherwise it could result in your credentials being broadcast in the clear
   over the network.

Login
=====

.. http:post:: /login

   Send a user's main authentication credentials to obtain a JWT to use with the API.

   **Example Request**:

   .. sourcecode:: http

      POST /login HTTP/1.1
      Host: iotblock.io

      {
        "username": "string",
        "password": "string"
      }

   **Example Response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Access-Control-Allow-Origin: *
      Content-Type: application/vnd.api+json

      {
        "data": {
          "type": "token",
          "id": "ccda8077356870dcb208c",
          "attributes": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM...",
            "issued_at": "2016-02-29T21:14:54Z",
            "expires_at": "2016-04-04T15:34:54Z",
            "principal": true,
            "private": false
          }
        }
      }

   :<json username: The username/screen name of an already registered IoTBlock user.
   :<json password: The password of the already registered IoTBlock user.
   :>json data: JSON object containing the token and its attributes.
   :>json type: The type of the returned data, in this case it must be ``token``.
   :>json id: The id of the token.
   :>json attributes: JSON object containing the actual attributes of the new token.
   :>json token: This attribute contains the actual encoded signed JWT that client software should then use to make requests.
   :>json issued_at: This attribute contains the timestamp at which the token was created.
   :>json expires_at: This attribute contains the timestamp at which time the token will expire.
   :>json principal: This boolean attribute will always be true for tokens obtained via the ``/login`` endpoint. A principal token means one that is intended to be used by the actual account holder as it has the full permissions of the user and so should not be treated as securely as a user's main credentials.
   :>json private: This boolean attribute indicates whether or not the user is permitted to see **private** resources.

Logout
======

.. http:get:: /logout

   Making a request to this URL causes all principal tokens to be invalidated so logging out the user.
