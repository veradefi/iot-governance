from iotblock_sdk.pathfinder import Catalogue
import iotblock_sdk.hypercat as hypercat
import json
import logging
TEST_PATHFINDER_URL_ROOT = "https://iotblock.io/cat"

def unittest():
    
    
    print("Running tests")
    logging.getLogger().setLevel(logging.DEBUG)

    print("Create a catalogue on Pathfinder")
    p = Catalogue(TEST_PATHFINDER_URL_ROOT, "ADMINSECRET")
    #h1 = hypercat.Hypercat("Dummy test catalogue")
    #p.create(h1)
    p.backup('backups/2.json');
    
    print("Read it")
    h2 = hypercat.loads(json.dumps(p.get()))

    #print "Did we get back what we wrote?"
    #print "h1:"
    #print h1.asJSON()
    #print "h2:"
    print(h2.asJSON())
    #assert(h1.asJSON() == h2.asJSON())

    #print "All tests passed"
    
if __name__ == '__main__':
    # Unit tests
    unittest()
