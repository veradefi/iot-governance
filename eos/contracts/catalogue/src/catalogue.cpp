// catalogue.cpp

#include "catalogue.hpp"

// note we are explcit in our use of eosio library functions
// note we liberally use print to assist in debugging

// public methods exposed via the ABI

void catalogue::version() {
    eosio::print("Catalogue version  0.22"); 
};

void catalogue::addcat(std::string hrefName) {
    // require_auth(s);

   eosio::print("Add href ", hrefName); 

   std::vector<uint64_t> keysForModify;
   bool found=false;
   // find all poll items
   for(auto& item : _catalogueTable) {
        if (item.hrefName == hrefName) {
            keysForModify.push_back(item.key);   
            found=true;
            break;
        }
   }
   
   if (!found) {
      eosio::print("upsert item", hrefName);
      _catalogueTable.emplace(get_self(), [&](auto& p) {
         p.key = _catalogueTable.available_primary_key();
         p.hrefId = _catalogueTable.available_primary_key();
         p.href = hrefName;
         p.hrefName = hrefName;
         p.hrefStatus = 0;
         p.option = "";
         p.metaCount = 0;
      });
   }

}



void catalogue::addmeta(std::string hrefName, std::string rel, std::string val) {
    eosio::print("Add meta data ", hrefName, "rel ", rel, "val ", val); 

   uint64_t hrefId=0;
   uint64_t relId=0;
   bool found=false;
   bool foundMeta=false;
   std::vector<uint64_t> keysForModify;

   for(auto& item : _catalogueTable) {
        if (item.hrefName == hrefName) {
            keysForModify.push_back(item.key);   
            found=true;
            hrefId=item.hrefId;
            relId=item.metaCount;
            break;
        }
   }
   
   if (!found) {
      eosio::print("upsert item", hrefName);
      _catalogueTable.emplace(get_self(), [&](auto& p) {
         p.key = _catalogueTable.available_primary_key();
         p.hrefId = _catalogueTable.available_primary_key();
         p.href = hrefName;
         p.hrefName = hrefName;
         p.hrefStatus = 0;
         p.option = "";
         p.metaCount = 0;
         hrefId=p.hrefId;
      });
   }

    // find the pollId, from _polls, use this to update the _polls with a new option
    for(auto& item : _metaTable) {
        if (item.hrefName == hrefName && item.rel==rel) {
            foundMeta=true;
            relId=item.relId;
            
        }
    }

    if (foundMeta) {
       auto itr2 = _metaTable.find(relId);
        if (itr2 != _metaTable.end()) {
            _metaTable.modify(itr2, get_self(), [&](auto& p) {
                p.val=val;
            });
            eosio::print("Updated ", rel, " to ", hrefName, " with ", val);
        }
    } else {
       _metaTable.emplace(get_self(), [&](auto& p) {
                    p.key = _metaTable.available_primary_key();
                    p.hrefId = hrefId;
                    p.hrefName = hrefName;
                    p.href = hrefName;
                    p.relId = _metaTable.available_primary_key();
                    p.rel=rel;
                    p.val=val;
                    });
      eosio::print("Inserted ", rel, " to ", hrefName, " with ", val);
   }
           
    
}

void catalogue::addgraphnode(std::string hrefName, std::string hrefName2) {
   eosio::print("Add graphNode ", hrefName, "to ", hrefName2); 

   uint64_t hrefId=0;
   uint64_t hrefId2=0;
   bool found=false;
   bool found2=false;
   std::vector<uint64_t> keysForModify;

   for(auto& item : _catalogueTable) {
        if (item.hrefName == hrefName) {
            keysForModify.push_back(item.key);   
            found=true;
            hrefId=item.hrefId;
        }

        if (item.hrefName == hrefName2) {
            keysForModify.push_back(item.key);   
            found2=true;
            hrefId2=item.hrefId;
        }
        if (found && found2) {
            break;
        }
   }
   
   if (!found) {
      eosio::print("upsert item", hrefName);
      _catalogueTable.emplace(get_self(), [&](auto& p) {
         p.key = _catalogueTable.available_primary_key();
         p.hrefId = _catalogueTable.available_primary_key();
         p.href = hrefName;
         p.hrefName = hrefName;
         p.hrefStatus = 0;
         p.option = "";
         p.metaCount = 0;
         hrefId=p.hrefId;
      });
   }
   if (!found2) {
      eosio::print("upsert item", hrefName2);
      _catalogueTable.emplace(get_self(), [&](auto& p) {
         p.key = _catalogueTable.available_primary_key();
         p.hrefId = _catalogueTable.available_primary_key();
         p.href = hrefName2;
         p.hrefName = hrefName2;
         p.hrefStatus = 0;
         p.option = "";
         p.metaCount = 0;
         hrefId2=p.hrefId;
      });
   }
 
   found=false;
   found2=false;
    // find the pollId, from _polls, use this to update the _polls with a new option
    for(auto& item : _graphNodeTable) {
        if (item.hrefName == hrefName && item.hrefName2 == hrefName2) {
            found=true;
        }
    }

    if (!found) {
       _graphNodeTable.emplace(get_self(), [&](auto& p) {
                    p.key = _graphNodeTable.available_primary_key();
                    p.hrefId = hrefId;
                    p.hrefName = hrefName;
                    p.hrefId2 = hrefId2;
                    p.hrefName2 = hrefName2;                    
       });
      eosio::print("Linked ", hrefName, " to ", hrefName2);
    } else {
      eosio::print("Found Already Linked ", hrefName, " to ", hrefName2);
    }
           
    
}


void catalogue::addpoll(eosio::name s, std::string pollName) {
    // require_auth(s);

    eosio::print("Add poll ", pollName); 

    // update the table to include a new poll
    _polls.emplace(get_self(), [&](auto& p) {
        p.key = _polls.available_primary_key();
        p.pollId = _polls.available_primary_key();
        p.pollName = pollName;
        p.pollStatus = 0;
        p.option = "";
        p.count = 0;
    });
}

void catalogue::rmpoll(eosio::name s, std::string pollName) {
    //require_auth(s);
    
    eosio::print("Remove poll ", pollName); 
        
    std::vector<uint64_t> keysForDeletion;
    // find items which are for the named poll
    for(auto& item : _polls) {
        if (item.pollName == pollName) {
            keysForDeletion.push_back(item.key);   
        }
    }
    
    // now delete each item for that poll
    for (uint64_t key : keysForDeletion) {
        eosio::print("remove from _polls ", key);
        auto itr = _polls.find(key);
        if (itr != _polls.end()) {
            _polls.erase(itr);
        }
    }


    // add remove votes ... don't need it the axtions are permanently stored on the block chain

    std::vector<uint64_t> keysForDeletionFromVotes;
    // find items which are for the named poll
    for(auto& item : _votes) {
        if (item.pollName == pollName) {
            keysForDeletionFromVotes.push_back(item.key);   
        }
    }
    
    // now delete each item for that poll
    for (uint64_t key : keysForDeletionFromVotes) {
        eosio::print("remove from _votes ", key);
        auto itr = _votes.find(key);
        if (itr != _votes.end()) {
            _votes.erase(itr);
        }
    }
}

void catalogue::status(std::string pollName) {
    eosio::print("Change poll status ", pollName);

    std::vector<uint64_t> keysForModify;
    // find items which are for the named poll
    for(auto& item : _polls) {
        if (item.pollName == pollName) {
            keysForModify.push_back(item.key);   
        }
    }
    
    // now get each item and modify the status
    for (uint64_t key : keysForModify) {
        eosio::print("modify _polls status", key);
        auto itr = _polls.find(key);
        if (itr != _polls.end()) {
            _polls.modify(itr, get_self(), [&](auto& p) {
                p.pollStatus = p.pollStatus + 1;
            });
        }
    }
}

void catalogue::statusreset(std::string pollName) {
    eosio::print("Reset poll status ", pollName); 

    std::vector<uint64_t> keysForModify;
    // find all poll items
    for(auto& item : _polls) {
        if (item.pollName == pollName) {
            keysForModify.push_back(item.key);   
        }
    }
    
    // update the status in each poll item
    for (uint64_t key : keysForModify) {
        eosio::print("modify _polls status", key);
        auto itr = _polls.find(key);
        if (itr != _polls.end()) {
            _polls.modify(itr, get_self(), [&](auto& p) {
                p.pollStatus = 0;
            });
        }
    }
}


void catalogue::addpollopt(std::string pollName, std::string option) {
    eosio::print("Add poll option ", pollName, "option ", option); 

    // find the pollId, from _polls, use this to update the _polls with a new option
    for(auto& item : _polls) {
        if (item.pollName == pollName) {
            // can only add if the poll is not started or finished
            if(item.pollStatus == 0) {
                _polls.emplace(get_self(), [&](auto& p) {
                    p.key = _polls.available_primary_key();
                    p.pollId = item.pollId;
                    p.pollName = item.pollName;
                    p.pollStatus = 0;
                    p.option = option;
                    p.count = 0;});
            }
            else {
                eosio::print("Can not add poll option ", pollName, "option ", option, " Poll has started or is finished.");
            }

            break; // so you only add it once
        }
    }
}

void catalogue::rmpollopt(std::string pollName, std::string option)
{
    eosio::print("Remove poll option ", pollName, "option ", option); 
        
    std::vector<uint64_t> keysForDeletion;
    // find and remove the named poll
    for(auto& item : _polls) {
        if (item.pollName == pollName) {
            keysForDeletion.push_back(item.key);   
        }
    }
        
    for (uint64_t key : keysForDeletion) {
        eosio::print("remove from _polls ", key);
        auto itr = _polls.find(key);
        if (itr != _polls.end()) {
            if (itr->option == option) {
                _polls.erase(itr);
            }
        }
    }
}


void catalogue::vote(std::string pollName, std::string option, std::string accountName)
{
    eosio::print("vote for ", option, " in poll ", pollName, " by ", accountName); 

    // is the poll open
    for(auto& item : _polls) {
        if (item.pollName == pollName) {
            if (item.pollStatus != 1) {
                eosio::print("Poll ",pollName,  " is not open");
                return;
            }
            break; // only need to check status once
        }
    }

    // has account name already voted?  
    for(auto& vote : _votes) {
        if (vote.pollName == pollName && vote.account == accountName) {
            eosio::print(accountName, " has already voted in poll ", pollName);
            //eosio_assert(true, "Already Voted");
            return;
        }
    }

    uint64_t pollId =99999; // get the pollId for the _votes table

    // find the poll and the option and increment the count
    for(auto& item : _polls) {
        if (item.pollName == pollName && item.option == option) {
            pollId = item.pollId; // for recording vote in this poll
            _polls.modify(item, get_self(), [&](auto& p) {
                p.count = p.count + 1;
            });
        }
    }

    // record that accountName has voted
    _votes.emplace(get_self(), [&](auto& pv){
        pv.key = _votes.available_primary_key();
        pv.pollId = pollId;
        pv.pollName = pollName;
        pv.account = accountName;
    });        
}


EOSIO_DISPATCH( catalogue, (version)(addcat)(addmeta)(addgraphnode)(addpoll)(rmpoll)(status)(statusreset)(addpollopt)(rmpollopt)(vote))

