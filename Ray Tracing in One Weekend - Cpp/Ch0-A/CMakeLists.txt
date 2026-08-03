cmake_minimum_required(VERSION 3.22)

project(Ch0_A VERSION 0.0.1)

set(CMAKE_CXX_STANDARD 17)

add_executable(Ch0_A main.cpp)

if(EMSCRIPTEN)

    #set_target_properties(Ch0_A PROPERTIES
    #    SUFFIX ".html"
    #)


    set_target_properties(Ch0_A PROPERTIES
        SUFFIX ".js"
    )

    target_link_options(Ch0_A PRIVATE

        "-sMODULARIZE=1"
        "-sEXPORT_NAME=Ch0_A"

        "-sEXPORTED_FUNCTIONS=['_menu']"

        "-sEXPORTED_RUNTIME_METHODS=['ccall']"
    )


    # Output folder
    set(WASM_OUTPUT_DIR "${CMAKE_SOURCE_DIR}/output")

    add_custom_command(TARGET Ch0_A POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E make_directory ${WASM_OUTPUT_DIR}

        COMMAND ${CMAKE_COMMAND} -E copy
            "$<TARGET_FILE:Ch0_A>"
            "${WASM_OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
            "$<TARGET_FILE_DIR:Ch0_A>/Ch0_A.js"
            "${WASM_OUTPUT_DIR}"

        COMMAND ${CMAKE_COMMAND} -E copy
            "$<TARGET_FILE_DIR:Ch0_A>/Ch0_A.wasm"
            "${WASM_OUTPUT_DIR}"

        COMMENT "Copying Emscripten files to output folder"
    )

endif()