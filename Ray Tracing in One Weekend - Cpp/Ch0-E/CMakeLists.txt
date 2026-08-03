cmake_minimum_required(VERSION 3.22)

project(Ch0_E)

set(CMAKE_CXX_STANDARD 17)


add_executable(Ch0_E
    main.cpp
)


if(EMSCRIPTEN)

set_target_properties(Ch0_E PROPERTIES
    SUFFIX ".html"
)


target_link_options(Ch0_E PRIVATE

    "-sWASM=1"

    "-sALLOW_MEMORY_GROWTH=1"

    "-sFORCE_FILESYSTEM=1"

    "-lidbfs.js"

    "-sEXPORTED_RUNTIME_METHODS=['FS','stringToNewUTF8']"

    "-sEXPORTED_FUNCTIONS=['_free']"

)



set(OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")


add_custom_command(TARGET Ch0_E POST_BUILD

COMMAND ${CMAKE_COMMAND} -E make_directory
"${OUTPUT_DIR}"


COMMAND ${CMAKE_COMMAND} -E copy
"$<TARGET_FILE:Ch0_E>"
"${OUTPUT_DIR}"


COMMAND ${CMAKE_COMMAND} -E copy
"$<TARGET_FILE_DIR:Ch0_E>/Ch0_E.js"
"${OUTPUT_DIR}"


COMMAND ${CMAKE_COMMAND} -E copy
"$<TARGET_FILE_DIR:Ch0_E>/Ch0_E.wasm"
"${OUTPUT_DIR}"


COMMENT "Copying WebAssembly files"

)

endif()