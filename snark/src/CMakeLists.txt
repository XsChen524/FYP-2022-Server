include_directories(.)

add_library(
  certificate
  SHARED
  certificate.cpp
  merklecircuit.h
)
target_link_libraries(
  certificate

  snark
)
target_include_directories(
  certificate

  PUBLIC
  ${DEPENDS_DIR}/libsnark
  ${DEPENDS_DIR}/libsnark/depends/libfqfft
  ${DEPENDS_DIR}/libsnark/depends/libff
)

add_executable(
  main

  main.cpp
)

target_link_libraries(
  main

  certificate
)
target_include_directories(
  main

  PUBLIC
  ${DEPENDS_DIR}/libsnark
  ${DEPENDS_DIR}/libsnark/depends/libfqfft
  ${DEPENDS_DIR}/libsnark/depends/libff
)