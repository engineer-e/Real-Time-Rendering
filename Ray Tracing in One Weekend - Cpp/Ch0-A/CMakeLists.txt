cmake_minimum_required(VERSION 3.22)

project(Ch0 VERSION 0.0.1)

set(CMAKE_CXX_STANDARD 17)

add_executable(Ch0 main.cpp)

if(EMSCRIPTEN)

    #set_target_properties(Ch0 PROPERTIES
    #    SUFFIX ".html"
    #)


    set_target_properties(Ch0 PROPERTIES
        SUFFIX ".js"
    )

    target_link_options(Ch0 PRIVATE

        "-sMODULARIZE=1"
        "-sEXPORT_NAME=Ch0"

        "-sEXPORTED_FUNCTIONS=['_menu']"

        "-sEXPORTED_RUNTIME_METHODS=['ccall']"
    )


    # Output folder
    set(WASM_OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")

    add_custom_command(TARGET Ch0 POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E make_directory ${WASM_OUTPUT_DIR}

        COMMAND ${CMAKE_COMMAND} -E copy
            "$<TARGET_FILE:Ch0>"
            "${WASM_OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
            "$<TARGET_FILE_DIR:Ch0>/Ch0.js"
            "${WASM_OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
            "$<TARGET_FILE_DIR:Ch0>/Ch0.wasm"
            "${WASM_OUTPUT_DIR}"

        COMMENT "Copying Emscripten files to output folder"
    )

endif()