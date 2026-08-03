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
      
      ```powershell
      Remove-Item * -Recurse -Force
      cmake .. -G Ninja -DCMAKE_TOOLCHAIN_FILE=D:/learn/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake 
      cmake --build . --config Release
      ```
      

      ```cmd
      cd ..
      rmdir /s /q build_wasm
      mkdir build_wasm
      cd build_wasm
      cmake .. -G Ninja -DCMAKE_TOOLCHAIN_FILE=D:/learn/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake 
      cmake --build . --config Release
      ```
      The device, I Using Emscripten.cmake in the
      
      ``` 
      path = "D:/learn/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake"
      ```
      for you device. want to change that.

      - 0.1 [Cin/Cout as Button in Console](href="https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-A/output/Ch0_A.html)
      - 0.2 [Cin/Cout as Button inside html](href="https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-A/output/Ch0_A.html)
      

      
      **Note :** **"Emscripten does not support `std::cin` as a normal terminal input mechanism because WebAssembly runs inside a browser environment, not a native command-line terminal. For terminal-based input/output, build the application as a native C++ executable. For Emscripten/WebAssembly builds, input must be provided through JavaScript, HTML, or another browser-based interface."**


  </details>

   