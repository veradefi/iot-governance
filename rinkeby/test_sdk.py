from iotblock_sdk.pathfinder import Catalogue
import iotblock_sdk.hypercat as hypercat
import json
import logging
TEST_PATHFINDER_URL_ROOT = "http://127.0.0.1:8888/cat/test2222222"

def unittest():
    
    meta=[
                {
                    "rel": "urn:Xhypercat:rels:supportsSearch",
                    "val": "urn:X-hypercat:search:simple"
                },
                {
                    "rel": "urn:X-space:rels:launchDate",
                    "val": "2018-06-29"
                },
                {
                    "rel": "urn:X-hypercat:rels:lastUpdated",
                    "val": "2018-06-291T18:12:55Z"
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
    print("Running tests")
    logging.getLogger().setLevel(logging.DEBUG)

    print("Create a catalogue on Pathfinder")
    p = Catalogue(TEST_PATHFINDER_URL_ROOT, "Vkc5clpXNGdZWEJwWDJ0bGVUMGlOakZtTVRobVpHTmhaRGt3T0RBNFpqZGtZMlV4WXpNM05UUmhOalV6WWprMU5UTXlaakZrTnpBM1ptUTFaamhoTnpjeU9EUmhZMlEwWVRCaU1HRTRPQ0lnWVhWMGFEMGlNSGcyUXpRd05UWTNNVEUwUkRObU5UUTVSV1V3TTBJeFlUTTBOakptTVRGa056SXhNMkkzTkRjNElpQmxkR2hmWTI5dWRISnBZajBpTVRBd01EQXdNREF3TURBd01EQWk6")
    h1 = hypercat.Hypercat("Dummy test catalogue", meta)
    h1_item=hypercat.Hypercat("Item Node", meta)
    h1_item2 = hypercat.Hypercat("Item's Item Node", meta)
    h1_item.addItem(h1_item2, TEST_PATHFINDER_URL_ROOT + '/subitem')
    h1.addItem(h1_item, TEST_PATHFINDER_URL_ROOT + '/item')
    print(h1);
    p.create(h1)
    #p.backup('backups/1.json');
    
    print("Read it")
    h2 = hypercat.loads(json.dumps(p.get()))

    print("Did we get back what we wrote?")
    print("h1:")
    print(h1.asJSON())
    print("h2:")
    print(h2.asJSON())
    assert(h1.asJSON() == h2.asJSON())

    print("All tests passed")
    
if __name__ == '__main__':
    # Unit tests
    unittest()
