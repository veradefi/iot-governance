#pragma once
#include <eosiolib/serialize.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/system.h>
#include <eosiolib/symbol.hpp>
#include <tuple>
#include <limits>

namespace eosio {

  /**
   *  @defgroup erc20api Asset API
   *  @brief Defines API for managing erc20s
   *  @ingroup contractdev
   */

  /**
   *  @defgroup erc20cppapi Asset CPP API
   *  @brief Defines %CPP API for managing erc20s
   *  @ingroup erc20api
   *  @{
   */

   /**
    * \struct Stores information for owner of erc20
    *
    * @brief Stores information for owner of erc20
    */

   
   struct erc20 {
      /**
       * The amount of the erc20
       *
       * @brief The amount of the erc20
       */
      int128_t amount = 0;

      /**
       * The symbol name of the erc20
       *
       * @brief The symbol name of the erc20
       */
      symbol  symbol;

      /**
       * Maximum amount possible for this erc20. It's capped to 2^62 - 1
       *
       * @brief Maximum amount possible for this erc20
       */
      static constexpr int128_t max_amount    = (1LL << 62) - 1;

      erc20() {}

      /**
       * Construct a new erc20 given the symbol name and the amount
       *
       * @brief Construct a new erc20 object
       * @param a - The amount of the erc20
       * @param s - The name of the symbol
       */
      erc20( int128_t a, class symbol s )
      :amount(a),symbol{s}
      {
         //eosio_assert( is_amount_within_range(), "magnitude of erc20 amount must be less than 2^62" );
         eosio_assert( symbol.is_valid(),        "invalid symbol name" );
      }

      /**
       * Check if the amount doesn't exceed the max amount
       *
       * @brief Check if the amount doesn't exceed the max amount
       * @return true - if the amount doesn't exceed the max amount
       * @return false - otherwise
       */
      bool is_amount_within_range()const { return true; } //-max_amount <= amount && amount <= max_amount; }

      /**
       * Check if the erc20 is valid. %A valid erc20 has its amount <= max_amount and its symbol name valid
       *
       * @brief Check if the erc20 is valid
       * @return true - if the erc20 is valid
       * @return false - otherwise
       */
      bool is_valid()const               { return is_amount_within_range() && symbol.is_valid(); }

      /**
       * Set the amount of the erc20
       *
       * @brief Set the amount of the erc20
       * @param a - New amount for the erc20
       */
      void set_amount( int128_t a ) {
         amount = a;
         eosio_assert( is_amount_within_range(), "magnitude of erc20 amount must be less than 2^62" );
      }

      /**
       * Unary minus operator
       *
       * @brief Unary minus operator
       * @return erc20 - New erc20 with its amount is the negative amount of this erc20
       */
      erc20 operator-()const {
         erc20 r = *this;
         r.amount = -r.amount;
         return r;
      }

      /**
       * Subtraction assignment operator
       *
       * @brief Subtraction assignment operator
       * @param a - Another erc20 to subtract this erc20 with
       * @return erc20& - Reference to this erc20
       * @post The amount of this erc20 is subtracted by the amount of erc20 a
       */
      erc20& operator-=( const erc20& a ) {
         eosio_assert( a.symbol == symbol, "attempt to subtract erc20 with different symbol" );
         amount -= a.amount;
         eosio_assert(amount >= a.amount, "subtraction overflow");
         //eosio_assert( -max_amount <= amount, "subtraction underflow" );
         //eosio_assert( amount <= max_amount,  "subtraction overflow" );
         return *this;
      }

      /**
       * Addition Assignment  operator
       *
       * @brief Addition Assignment operator
       * @param a - Another erc20 to subtract this erc20 with
       * @return erc20& - Reference to this erc20
       * @post The amount of this erc20 is added with the amount of erc20 a
       */
      erc20& operator+=( const erc20& a ) {
         eosio_assert( a.symbol == symbol, "attempt to add erc20 with different symbol" );
         amount += a.amount;
         eosio_assert(amount <= a.amount, "addition overflow");
         //eosio_assert( -max_amount <= amount, "addition underflow" );
         //eosio_assert( amount <= max_amount,  "addition overflow" );
         return *this;
      }

      /**
       * Addition operator
       *
       * @brief Addition operator
       * @param a - The first erc20 to be added
       * @param b - The second erc20 to be added
       * @return erc20 - New erc20 as the result of addition
       */
      inline friend erc20 operator+( const erc20& a, const erc20& b ) {
         erc20 result = a;
         result += b;
         return result;
      }

      /**
       * Subtraction operator
       *
       * @brief Subtraction operator
       * @param a - The erc20 to be subtracted
       * @param b - The erc20 used to subtract
       * @return erc20 - New erc20 as the result of subtraction of a with b
       */
      inline friend erc20 operator-( const erc20& a, const erc20& b ) {
         erc20 result = a;
         result -= b;
         return result;
      }

      /**
       * Multiplication assignment operator. Multiply the amount of this erc20 with a number and then assign the value to itself.
       *
       * @brief Multiplication assignment operator, with a number
       * @param a - The multiplier for the erc20's amount
       * @return erc20 - Reference to this erc20
       * @post The amount of this erc20 is multiplied by a
       */
      erc20& operator*=( int128_t a ) {
         if (a == 0 || amount == 0) {
             amount = 0;
             return *this;
         }

         int128_t tmp = (int128_t)amount * (int128_t)a;
         eosio_assert(tmp / amount == a, "multiplication overflow");
         //eosio_assert( tmp <= max_amount, "multiplication overflow" );
         //eosio_assert( tmp >= -max_amount, "multiplication underflow" );
         amount = (int128_t)tmp;
         return *this;
      }

      /**
       * Multiplication operator, with a number proceeding
       *
       * @brief Multiplication operator, with a number proceeding
       * @param a - The erc20 to be multiplied
       * @param b - The multiplier for the erc20's amount
       * @return erc20 - New erc20 as the result of multiplication
       */
      friend erc20 operator*( const erc20& a, int128_t b ) {
         erc20 result = a;
         result *= b;
         return result;
      }


      /**
       * Multiplication operator, with a number preceeding
       *
       * @brief Multiplication operator, with a number preceeding
       * @param a - The multiplier for the erc20's amount
       * @param b - The erc20 to be multiplied
       * @return erc20 - New erc20 as the result of multiplication
       */
      friend erc20 operator*( int128_t b, const erc20& a ) {
         erc20 result = a;
         result *= b;
         return result;
      }

      /**
       * Division assignment operator. Divide the amount of this erc20 with a number and then assign the value to itself.
       *
       * @brief Division assignment operator, with a number
       * @param a - The divisor for the erc20's amount
       * @return erc20 - Reference to this erc20
       * @post The amount of this erc20 is divided by a
       */
      erc20& operator/=( int128_t a ) {
         eosio_assert( a != 0, "divide by zero" );
         eosio_assert( !(amount == std::numeric_limits<int128_t>::min() && a == -1), "signed division overflow" );
         amount /= a;
         return *this;
      }

      /**
       * Division operator, with a number proceeding
       *
       * @brief Division operator, with a number proceeding
       * @param a - The erc20 to be divided
       * @param b - The divisor for the erc20's amount
       * @return erc20 - New erc20 as the result of division
       */
      friend erc20 operator/( const erc20& a, int128_t b ) {
         erc20 result = a;
         result /= b;
         return result;
      }

      /**
       * Division operator, with another erc20
       *
       * @brief Division operator, with another erc20
       * @param a - The erc20 which amount acts as the dividend
       * @param b - The erc20 which amount acts as the divisor
       * @return int128_t - the resulted amount after the division
       * @pre Both erc20 must have the same symbol
       */
      friend int128_t operator/( const erc20& a, const erc20& b ) {
         eosio_assert( b.amount != 0, "divide by zero" );
         eosio_assert( a.symbol == b.symbol, "comparison of erc20s with different symbols is not allowed" );
         return a.amount / b.amount;
      }

      /**
       * Equality operator
       *
       * @brief Equality operator
       * @param a - The first erc20 to be compared
       * @param b - The second erc20 to be compared
       * @return true - if both erc20 has the same amount
       * @return false - otherwise
       * @pre Both erc20 must have the same symbol
       */
      friend bool operator==( const erc20& a, const erc20& b ) {
         eosio_assert( a.symbol == b.symbol, "comparison of erc20s with different symbols is not allowed" );
         return a.amount == b.amount;
      }

      /**
       * Inequality operator
       *
       * @brief Inequality operator
       * @param a - The first erc20 to be compared
       * @param b - The second erc20 to be compared
       * @return true - if both erc20 doesn't have the same amount
       * @return false - otherwise
       * @pre Both erc20 must have the same symbol
       */
      friend bool operator!=( const erc20& a, const erc20& b ) {
         return !( a == b);
      }

      /**
       * Less than operator
       *
       * @brief Less than operator
       * @param a - The first erc20 to be compared
       * @param b - The second erc20 to be compared
       * @return true - if the first erc20's amount is less than the second erc20 amount
       * @return false - otherwise
       * @pre Both erc20 must have the same symbol
       */
      friend bool operator<( const erc20& a, const erc20& b ) {
         eosio_assert( a.symbol == b.symbol, "comparison of erc20s with different symbols is not allowed" );
         return a.amount < b.amount;
      }

      /**
       * Less or equal to operator
       *
       * @brief Less or equal to operator
       * @param a - The first erc20 to be compared
       * @param b - The second erc20 to be compared
       * @return true - if the first erc20's amount is less or equal to the second erc20 amount
       * @return false - otherwise
       * @pre Both erc20 must have the same symbol
       */
      friend bool operator<=( const erc20& a, const erc20& b ) {
         eosio_assert( a.symbol == b.symbol, "comparison of erc20s with different symbols is not allowed" );
         return a.amount <= b.amount;
      }

      /**
       * Greater than operator
       *
       * @brief Greater than operator
       * @param a - The first erc20 to be compared
       * @param b - The second erc20 to be compared
       * @return true - if the first erc20's amount is greater than the second erc20 amount
       * @return false - otherwise
       * @pre Both erc20 must have the same symbol
       */
      friend bool operator>( const erc20& a, const erc20& b ) {
         eosio_assert( a.symbol == b.symbol, "comparison of erc20s with different symbols is not allowed" );
         return a.amount > b.amount;
      }

      /**
       * Greater or equal to operator
       *
       * @brief Greater or equal to operator
       * @param a - The first erc20 to be compared
       * @param b - The second erc20 to be compared
       * @return true - if the first erc20's amount is greater or equal to the second erc20 amount
       * @return false - otherwise
       * @pre Both erc20 must have the same symbol
       */
      friend bool operator>=( const erc20& a, const erc20& b ) {
         eosio_assert( a.symbol == b.symbol, "comparison of erc20s with different symbols is not allowed" );
         return a.amount >= b.amount;
      }

      /**
       * %Print the erc20
       *
       * @brief %Print the erc20
       */
      void print()const {
         int128_t p = (int128_t)symbol.precision();
         int128_t p10 = 1;
         while( p > 0  ) {
            p10 *= 10; --p;
         }
         p = (int128_t)symbol.precision();

         char fraction[p+1];
         fraction[p] = '\0';
         auto change = amount % p10;

         for( int128_t i = p -1; i >= 0; --i ) {
            fraction[i] = (change % 10) + '0';
            change /= 10;
         }
         printi( amount / p10 );
         prints(".");
         prints_l( fraction, uint32_t(p) );
         prints(" ");
         symbol.print(false);
      }

      EOSLIB_SERIALIZE( erc20, (amount)(symbol) )
   };

  /**
   * \struct Extended erc20 which stores the information of the owner of the erc20
   *
   * @brief Extended erc20 which stores the information of the owner of the erc20
   */
   struct extended_erc20 {
      /**
       * The erc20
       */
      erc20 quantity;

      /**
       * The owner of the erc20
       *
       * @brief The owner of the erc20
       */
      name contract;

      /**
       * Get the extended symbol of the erc20
       *
       * @brief Get the extended symbol of the erc20
       * @return extended_symbol - The extended symbol of the erc20
       */
      extended_symbol get_extended_symbol()const { return extended_symbol{ quantity.symbol, contract }; }

      /**
       * Default constructor
       *
       * @brief Construct a new extended erc20 object
       */
      extended_erc20() = default;

       /**
       * Construct a new extended erc20 given the amount and extended symbol
       *
       * @brief Construct a new extended erc20 object
       */
      extended_erc20( int128_t v, extended_symbol s ):quantity(v,s.get_symbol()),contract(s.get_contract()){}
      /**
       * Construct a new extended erc20 given the erc20 and owner name
       *
       * @brief Construct a new extended erc20 object
       */
      extended_erc20( erc20 a, name c ):quantity(a),contract(c){}

      /**
       * %Print the extended erc20
       *
       * @brief %Print the extended erc20
       */
      void print()const {
         quantity.print();
         prints("@");
         printn(contract.value);
      }

       /**
       *  Unary minus operator
       *
       *  @brief Unary minus operator
       *  @return extended_erc20 - New extended erc20 with its amount is the negative amount of this extended erc20
       */
      extended_erc20 operator-()const {
         return {-quantity, contract};
      }

      /**
       * Subtraction operator. This subtracts the amount of the extended erc20.
       *
       * @brief Subtraction operator
       * @param a - The extended erc20 to be subtracted
       * @param b - The extended erc20 used to subtract
       * @return extended_erc20 - New extended erc20 as the result of subtraction
       * @pre The owner of both extended erc20 need to be the same
       */
      friend extended_erc20 operator - ( const extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         return {a.quantity - b.quantity, a.contract};
      }

      /**
       * Addition operator. This adds the amount of the extended erc20.
       *
       * @brief Addition operator
       * @param a - The extended erc20 to be added
       * @param b - The extended erc20 to be added
       * @return extended_erc20 - New extended erc20 as the result of addition
       * @pre The owner of both extended erc20 need to be the same
       */
      friend extended_erc20 operator + ( const extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         return {a.quantity + b.quantity, a.contract};
      }

      /// Addition operator.
      friend extended_erc20& operator+=( extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         a.quantity += b.quantity;
         return a;
      }

      /// Subtraction operator.
      friend extended_erc20& operator-=( extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         a.quantity -= b.quantity;
         return a;
      }

      /// Less than operator
      friend bool operator<( const extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         return a.quantity < b.quantity;
      }


      /// Comparison operator
      friend bool operator==( const extended_erc20& a, const extended_erc20& b ) {
         return std::tie(a.quantity, a.contract) == std::tie(b.quantity, b.contract);
      }

      /// Comparison operator
      friend bool operator!=( const extended_erc20& a, const extended_erc20& b ) {
         return std::tie(a.quantity, a.contract) != std::tie(b.quantity, b.contract);
      }

      /// Comparison operator
      friend bool operator<=( const extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         return a.quantity <= b.quantity;
      }

      /// Comparison operator
      friend bool operator>=( const extended_erc20& a, const extended_erc20& b ) {
         eosio_assert( a.contract == b.contract, "type mismatch" );
         return a.quantity >= b.quantity;
      }

      EOSLIB_SERIALIZE( extended_erc20, (quantity)(contract) )
   };

/// @} erc20 type
} /// namespace eosio
