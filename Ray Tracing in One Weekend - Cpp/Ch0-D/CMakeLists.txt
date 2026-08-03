cmake_minimum_required(VERSION 3.22)

project(Ch0_D)

set(CMAKE_CXX_STANDARD 17)

add_executable(Ch0_D
    main.cpp
)

if(EMSCRIPTEN)

    set_target_properties(Ch0_D PROPERTIES
        SUFFIX ".html"
    )

    target_link_options(Ch0_D PRIVATE
    "-sWASM=1"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sEXIT_RUNTIME=1"
    "--preload-file"
    "${CMAKE_SOURCE_DIR}/test@/test"
)

    set(OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")
add_custom_command(TARGET Ch0_D POST_BUILD

    COMMAND ${CMAKE_COMMAND} -E make_directory
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE:Ch0_D>"
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE_DIR:Ch0_D>/Ch0_D.js"
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE_DIR:Ch0_D>/Ch0_D.wasm"
    "${OUTPUT_DIR}"

    COMMAND ${CMAKE_COMMAND} -E copy
    "$<TARGET_FILE_DIR:Ch0_D>/Ch0_D.data"
    "${OUTPUT_DIR}"

    COMMENT "Copying Ch0_D WebAssembly files"
)

endif()