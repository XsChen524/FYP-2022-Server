#ifndef __certificate_h__
#define __certificate_h__

#define CURVE_ALT_BN128

#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <random>
#include <boost/optional.hpp>
#include "merklecircuit.h"

using namespace libsnark;

template<typename ppzksnark_ppT, typename FieldT, typename HashT>
r1cs_gg_ppzksnark_keypair<ppzksnark_ppT> generate_read_keypair(const size_t tree_depth);

template<typename ppzksnark_ppT, typename FieldT, typename HashT>
boost::optional<r1cs_gg_ppzksnark_proof<ppzksnark_ppT>> generate_read_proof(r1cs_gg_ppzksnark_proving_key<ppzksnark_ppT> proving_key,
                                                                    const size_t tree_depth,
                                                                    libff::bit_vector& sk, libff::bit_vector& rk, libff::bit_vector& leaf,
                                                                    libff::bit_vector& root, merkle_authentication_path& path,
                                                                    const size_t address, libff::bit_vector& address_bits);

template<typename ppzksnark_ppT, typename FieldT>
bool verify_read_proof(r1cs_gg_ppzksnark_verification_key<ppzksnark_ppT> verification_key,
                  r1cs_gg_ppzksnark_proof<ppzksnark_ppT> proof, libff::bit_vector& root, libff::bit_vector& rk);

template<typename HashT>
boost::optional<std::string> binToHex(libff::bit_vector& bin);

std::string hexToChar(const char c);

libff::bit_vector hexToBin(std::string& str);

std::vector<std::string> split(std::string& str, std::string delim);

template<typename HashT>
libff::bit_vector hash256(std::string str);

template<typename HashT>
libff::bit_vector hash_two_to_one(libff::bit_vector bv1, libff::bit_vector bv2);

std::string strRand();

/**
 * @brief 
 * 
 * @param userId 
 * @param secStr 
 * @param randomKey 
 * @return std::string rootStr
 */
std::string GenerateProof(std::string secStr, std::string randomKey);

bool VerifyProof (std::string randomKey, std::string rootStr);

#endif
