# Ray Tracing in One Weekend - Cpp

0. <details>
     <summary><a href="https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0/output/Ch0.html">Initial Setup Check</a></summary>
 
      - [CMake](https://visualstudio.microsoft.com/downloads/)
      - [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) ,
      - **Ninja - Compiler** 
        ```
         winget install Ninja-build.Ninja 
         ninja --version
        ```
      -  [**Visual Studio C & C++ Compiler**](https://visualstudio.microsoft.com/downloads/)

      # Run
      
      ```
      cmake .. -G Ninja -DCMAKE_TOOLCHAIN_FILE=D:/learn/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake 
      cmake --build . --config Release
      ```
      The device, I Using Emscripten.cmake in the
      
      ``` 
      path = "D:/learn/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake"
      ```
      for you device. want to change that.

  </details>

   