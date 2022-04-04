#ifndef __MERKLECIRCUIT_H__
#define __MERKLECIRCUIT_H__

#include <libff/common/default_types/ec_pp.hpp>
#include <libsnark/zk_proof_systems/ppzksnark/r1cs_gg_ppzksnark/r1cs_gg_ppzksnark.hpp>
#include <libsnark/gadgetlib1/gadgets/merkle_tree/merkle_tree_check_read_gadget.hpp>
#include <libsnark/gadgetlib1/gadgets/hashes/sha256/sha256_gadget.hpp>

using namespace libsnark;
namespace sample {
    template<typename FieldT, typename HashT>
    class MerkleCircuit
    {
    public:
        const size_t digest_size;
        const size_t tree_depth;
        std::shared_ptr<digest_variable<FieldT>> root_digest;
        std::shared_ptr<digest_variable<FieldT>> random_key;    // hash the random key
        std::shared_ptr<digest_variable<FieldT>> secret;        // hash all the secret
        std::shared_ptr<digest_variable<FieldT>> leaf_digest;    // store leaf digest = hash(secret||rk), secret = hash(name||hkid||...)
        //std::shared_ptr<digest_variable<FieldT>> leaf_digest;
        pb_variable_array<FieldT> address_bits_var;
        std::shared_ptr<merkle_authentication_path_variable<FieldT, HashT>> path_var;
        std::shared_ptr<merkle_tree_check_read_gadget<FieldT, HashT>> merkle;
        std::shared_ptr<sha256_two_to_one_hash_gadget<FieldT>> hash_func;

        MerkleCircuit(protoboard<FieldT>& pb, const size_t& depth):
            digest_size(HashT::get_digest_len()),
            tree_depth(depth)
        {
            root_digest = std::make_shared<digest_variable<FieldT>>(pb, digest_size, "root");
            random_key = std::make_shared<digest_variable<FieldT>>(pb, digest_size, "rk");
            secret = std::make_shared<digest_variable<FieldT>>(pb, digest_size, "sk");
            leaf_digest= std::make_shared<digest_variable<FieldT>>(pb, digest_size, "leaf");
            hash_func = std::make_shared<sha256_two_to_one_hash_gadget<FieldT>>(pb, *secret, *random_key, *leaf_digest, "hashF");
            path_var = std::make_shared<merkle_authentication_path_variable<FieldT, HashT>>(pb, tree_depth, "path");
            address_bits_var.allocate(pb, tree_depth, "address_bits");
            merkle = std::make_shared<merkle_tree_check_read_gadget<FieldT, HashT>>(pb, tree_depth, address_bits_var, *leaf_digest, *root_digest, *path_var, ONE, "merkle");
            pb.set_input_sizes(SHA256_digest_size*2);
        }

        void generate_r1cs_constraints() {
            hash_func->generate_r1cs_constraints();
            path_var->generate_r1cs_constraints();
            merkle->generate_r1cs_constraints();
        }

        void generate_r1cs_witness(protoboard<FieldT>& pb, 
                                   libff::bit_vector& sk,libff::bit_vector& rk,libff::bit_vector& leaf,
                                   libff::bit_vector& root, merkle_authentication_path& path,
                                   const size_t address, libff::bit_vector& address_bits) {
            secret->generate_r1cs_witness(sk);
            random_key->generate_r1cs_witness(rk);
            leaf_digest->generate_r1cs_witness(leaf);
            hash_func->generate_r1cs_witness();   // generate the witness for hash func                           
            root_digest->generate_r1cs_witness(root);
            address_bits_var.fill_with_bits(pb, address_bits);
            assert(address_bits_var.get_field_element_from_bits(pb).as_ulong() == address);
            path_var->generate_r1cs_witness(address, path);
            merkle->generate_r1cs_witness();
        }
    };
}
#endif //MERKLECIRCUIT_H
