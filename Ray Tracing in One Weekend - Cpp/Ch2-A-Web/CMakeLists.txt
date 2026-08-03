cmake_minimum_required(VERSION 3.22)

project(Ch2_A)


set(CMAKE_CXX_STANDARD 17)



add_executable(
    Ch2_A
    main.cpp
)



if(EMSCRIPTEN)


set_target_properties(
    Ch2_A
    PROPERTIES
    SUFFIX ".html"
)



target_link_options(
    Ch2_A PRIVATE

    "-sUSE_SDL=1"

    "-sWASM=1"

    "-sALLOW_MEMORY_GROWTH=1"

    "-sFETCH=1"

)



else()


find_package(SDL REQUIRED)


target_include_directories(
    Ch2_A PRIVATE
    ${SDL_INCLUDE_DIR}
)


target_link_libraries(
    Ch2_A
    ${SDL_LIBRARY}
)


endif()