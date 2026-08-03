cmake_minimum_required(VERSION 3.22)

project(Ch0_F)

set(CMAKE_CXX_STANDARD 17)

add_executable(Ch0_F
    main.cpp
)

if(EMSCRIPTEN)

set_target_properties(Ch0_F PROPERTIES
    SUFFIX ".html"
)

target_link_options(Ch0_F PRIVATE

    "-sWASM=1"

    "-sALLOW_MEMORY_GROWTH=1"

    "-sFORCE_FILESYSTEM=1"

    "-lidbfs.js"

    "-sEXPORTED_RUNTIME_METHODS=['FS','stringToNewUTF8']"

    "-sEXPORTED_FUNCTIONS=['_free']"

)

set(OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")

add_custom_command(TARGET Ch0_F POST_BUILD

    COMMAND ${CMAKE_COMMAND} -E make_directory
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE:Ch0_F>"
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE_DIR:Ch0_F>/Ch0_F.js"
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE_DIR:Ch0_F>/Ch0_F.wasm"
    "${OUTPUT_DIR}"

    COMMENT "Copying WebAssembly files"

)

endif()