cmake_minimum_required(VERSION 3.22)

project(Ch0 VERSION 0.0.1)

set(CMAKE_CXX_STANDARD 17)

add_executable(Ch0 main.cpp)

if(EMSCRIPTEN)
    set_target_properties(Ch0 PROPERTIES
        SUFFIX ".html"
    )

    target_link_options(Ch0 PRIVATE
        "-sALLOW_MEMORY_GROWTH=1"
    )
endif()