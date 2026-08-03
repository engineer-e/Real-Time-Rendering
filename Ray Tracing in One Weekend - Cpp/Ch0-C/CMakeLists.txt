cmake_minimum_required(VERSION 3.22)

project(Ch0_C)

set(CMAKE_CXX_STANDARD 17)


add_executable(Ch0_C
    main.cpp
)

if(EMSCRIPTEN)

    set_target_properties(Ch0_C PROPERTIES
        SUFFIX ".html"
    )

    target_link_options(Ch0_C PRIVATE
        "-sUSE_SDL=1"
        "-sWASM=1"
        "-sALLOW_MEMORY_GROWTH=1"
    )

    set(OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")

    add_custom_command(TARGET Ch0_C POST_BUILD

        COMMAND ${CMAKE_COMMAND} -E make_directory
        "${OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
        "$<TARGET_FILE:Ch0_C>"
        "${OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
        "$<TARGET_FILE_DIR:Ch0_C>/Ch0_C.js"
        "${OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
        "$<TARGET_FILE_DIR:Ch0_C>/Ch0_C.wasm"
        "${OUTPUT_DIR}"

        COMMENT "Copying Ch0_C WebAssembly files"
    )

endif()