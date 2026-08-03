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

      - 0.1 [Cin/Cout as Button in Console](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-A/output/Ch0_A.html)
      - 0.2 [Cin/Cout as Button inside html](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-B/output/Ch0_B.html)
      - 0.3 [SDL Setup](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-C/output/Ch0_C.html)
        - **NOTE:** This project uses SDL 1.2 compatibility (`-sUSE_SDL=1`); for new projects, SDL2 (`-sUSE_SDL=2`) is recommended.
      - 0.4 [Text File Read](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-D/output/Ch0_D.html)
      - 0.5 [Text File Read/Write](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-E/output/Ch0_E.html)
      - 0.6 [Slider,CheckBox](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch0-F/output/Ch0_F.html)

      
      **Note :** **"Emscripten does not support `std::cin` as a normal terminal input mechanism because WebAssembly runs inside a browser environment, not a native command-line terminal. For terminal-based input/output, build the application as a native C++ executable. For Emscripten/WebAssembly builds, input must be provided through JavaScript, HTML, or another browser-based interface."**

      # PPM File Viewer

      ### Example:
      
      https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch2-A-Web/output/Ch2_A.html?image=https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch2-A-Web/output/image.ppm


  </details>

1. C++ Code & Overview
2. Output an Image
   - 2.1 [The PPM Image Format](https://en.wikipedia.org/wiki/Netpbm)
   - 2.2 [Creating an Image File](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch2-A-Web/output/Ch2_A.html?image=https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Cpp/Ch2-A/output/image.ppm)
   - 2.3 [Adding a Progress Indicator]()