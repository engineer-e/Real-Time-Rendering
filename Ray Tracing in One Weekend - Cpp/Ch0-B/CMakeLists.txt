cmake_minimum_required(VERSION 3.22)

project(Ch0_B)

set(CMAKE_CXX_STANDARD 17)

add_executable(Ch0_B main.cpp)


if(EMSCRIPTEN)

    set_target_properties(Ch0_B PROPERTIES
        SUFFIX ".js"
    )

    target_link_options(Ch0_B PRIVATE

        "-sMODULARIZE=1"
        "-sEXPORT_NAME=Ch0"

        "-sEXPORTED_FUNCTIONS=['_menu']"

        "-sEXPORTED_RUNTIME_METHODS=['ccall']"

        "-sWASM=1"
        "--no-entry"
    )


    set(OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")


    add_custom_command(TARGET Ch0_B POST_BUILD

        COMMAND ${CMAKE_COMMAND} -E make_directory
        ${OUTPUT_DIR}

        COMMAND ${CMAKE_COMMAND} -E copy
        "$<TARGET_FILE:Ch0_B>"
        "${OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
        "$<TARGET_FILE_DIR:Ch0_B>/Ch0_B.wasm"
        "${OUTPUT_DIR}"

        COMMENT "Copying WebAssembly files"
    )

endif()