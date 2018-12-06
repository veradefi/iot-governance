// this is the header file catalogue.hpp

#pragma once

#include <eosiolib/eosio.hpp>

//using namespace eosio; -- not using this so you can explicitly see which eosio functions are used.

class [[eosio::contract]] catalogue : public eosio::contract {

public:

    //using contract::contract;

    catalogue( eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds ): eosio::contract(receiver, code, ds),  _polls(receiver, code.value), _votes(receiver, code.value), _catalogueTable(receiver, code.value), _metaTable(receiver, code.value), _graphNodeTable(receiver, code.value)
    {}

    // [[eosio::action]] will tell eosio-cpp that the function is to be exposed as an action for user of the smart contract.
    [[eosio::action]] void version();
    [[eosio::action]] void addcat(std::string hrefName);
    [[eosio::action]] void addmeta(std::string hrefName, std::string rel, std::string val);
    [[eosio::action]] void addgraphnode(std::string hrefName, std::string hrefName2);
    [[eosio::action]] void addpoll(eosio::name s, std::string pollName);
    [[eosio::action]] void rmpoll(eosio::name s, std::string pollName);
    [[eosio::action]] void status(std::string pollName);
    [[eosio::action]] void statusreset(std::string pollName);
    [[eosio::action]] void addpollopt(std::string pollName, std::string option);
    [[eosio::action]] void rmpollopt(std::string pollName, std::string option);
    [[eosio::action]] void vote(std::string pollName, std::string option, std::string accountName);

    //private: -- not private so the cleos get table call can see the table data.

    // create the multi index tables to store the data
    struct [[eosio::table]] poll 
    {
        uint64_t      key; // primary key
        uint64_t      pollId; // second key, non-unique, this table will have dup rows for each poll because of option
        std::string   pollName; // name of poll
        uint8_t      pollStatus =0; // staus where 0 = closed, 1 = open, 2 = finished
        std::string  option; // the item you can vote for
        uint32_t    count =0; // the number of votes for each itme -- this to be pulled out to separte table.

        uint64_t primary_key() const { return key; }
        uint64_t by_pollId() const {return pollId; }
    };
    typedef eosio::multi_index<"poll"_n, poll, eosio::indexed_by<"pollid"_n, eosio::const_mem_fun<poll, uint64_t, &poll::by_pollId>>> pollstable;

    struct [[eosio::table]] pollvotes 
    {
        uint64_t     key; 
        uint64_t     pollId;
        std::string  pollName; // name of poll
        std::string  account; //this account has voted, use this to make sure noone votes > 1

        uint64_t primary_key() const { return key; }
        uint64_t by_pollId() const {return pollId; }
    };
    typedef eosio::multi_index<"pollvotes"_n, pollvotes, eosio::indexed_by<"pollid"_n, eosio::const_mem_fun<pollvotes, uint64_t, &pollvotes::by_pollId>>> votes;

    //// local instances of the multi indexes
    pollstable _polls;
    votes _votes;

    // create the multi index tables to store the data
    struct [[eosio::table]] catdata
    {
        uint64_t      key; // primary key

        uint64_t      hrefId; // second key, non-unique, this table will have dup rows for each node because of option
        std::string   hrefName; // name of node
        std::string   href; // name of node
        uint8_t       hrefStatus =0; // staus where 0 = closed, 1 = open, 2 = finished
        std::string   option; // the item you can vote for
        uint32_t      metaCount =0; // the number of votes for each itme -- this to be pulled out to separte table.
        uint32_t      health = 0;

        uint64_t primary_key() const { return key; }
        uint64_t by_hrefId() const {return hrefId; }
    };
    typedef eosio::multi_index
            <
                "catdata"_n, catdata, 
                eosio::indexed_by<
                    "hrefid"_n, eosio::const_mem_fun
                    <
                        catdata, uint64_t, &catdata::by_hrefId
                    >
                >
            > catalogueTable;


    struct [[eosio::table]] metadata 
    {
        uint64_t     key; 

        std::string  hrefName;
        std::string  href;
        uint64_t      hrefId; // second key, non-unique, this table will have dup rows for each node because of option

        std::string  rel; // name of node
        uint64_t      relId; // second key, non-unique, this table will have dup rows for each node because of option

        std::string  val; // name of node
        std::string  account; //this account has voted, use this to make sure noone votes > 1
        uint32_t     relcount =0;

        uint64_t primary_key() const { return key; }
        uint64_t by_hrefId() const {return hrefId; }
        uint64_t by_relId() const {return relId; }
    };
    typedef eosio::multi_index
            <
                "metadata"_n, metadata, 
                eosio::indexed_by<
                    "href"_n, eosio::const_mem_fun
                    <
                        metadata, uint64_t, &metadata::by_hrefId
                    >
                >,
                eosio::indexed_by<
                    "rel"_n, eosio::const_mem_fun
                    <
                        metadata, uint64_t, &metadata::by_relId
                    >
                >
            > metaTable;

    // create the multi index tables to store the data
    struct [[eosio::table]] graphdata
    {
        uint64_t      key; // primary key

        uint64_t      hrefId; // second key, non-unique, this table will have dup rows for each node because of option
        uint64_t      hrefId2; // second key, non-unique, this table will have dup rows for each node because of option
        std::string   hrefName; // name of node
        std::string   hrefName2; // name of node
        uint8_t       hrefStatus =0; // staus where 0 = closed, 1 = open, 2 = finished
        
        uint64_t primary_key() const { return key; }
        uint64_t by_hrefId() const {return hrefId; }
        uint64_t by_hrefId2() const {return hrefId2; }
    };

    typedef eosio::multi_index
            <
                "graphdata"_n, graphdata, 
                eosio::indexed_by<
                    "hrefid"_n, eosio::const_mem_fun
                    <
                        graphdata, uint64_t, &graphdata::by_hrefId
                    >
                >,
                eosio::indexed_by<
                    "hrefid2"_n, eosio::const_mem_fun
                    <
                        graphdata, uint64_t, &graphdata::by_hrefId2
                    >
                >
            > graphNodeTable;


    //// local instances of the multi indexes
    graphNodeTable _graphNodeTable;
    catalogueTable _catalogueTable;
    metaTable _metaTable;
};


