---
slug: build-linux
title: 'Building Tonatiuh++ on Ubuntu Linux'
authors: mblanco
tags: [linux, ubuntu, build, development]
---

![Tonatiuh++ running on Ubuntu Linux](/img/tonatiuhXX-ubuntu-linux-screenshot.png)

Ubuntu Linux provides an excellent environment for building Tonatiuh++ from source thanks to powerful package management tools, modern C++ compilers, and first-class CMake support. This guide explains how to install all necessary dependencies, compile third-party libraries, and build the full Tonatiuh++ application on Ubuntu 22.04 or later.

<!-- truncate -->

# 1. Install Required Build Tools

Begin by installing essential development utilities:

```bash
    sudo apt update
    sudo apt install -y build-essential cmake git python3 python3-pip
```

This installs:

- GCC/G++ (C++17 capable)
- Make tools
- CMake
- Git
- Python (required for build_deps.py)

Verify GCC:

```bash
    g++ --version
```

It should report GCC 11 or newer.

# 2. Install Qt 6

Ubuntu’s repositories include Qt 6, which works well for Tonatiuh++.

Install the Qt development packages:

```bash
    sudo apt install -y qt6-base-dev qt6-base-dev-tools qt6-tools-dev qt6-tools-dev-tools
```

This installs:

- Qt 6 libraries
- qmake and Qt tools
- CMake integration files for Qt

CMake will automatically detect Qt in: /usr/lib/x86_64-linux-gnu/cmake/Qt6/

# 3. Install Additional Dependencies

Tonatiuh++ builds most third-party dependencies itself, but a few system packages improve compatibility:

```bash
    sudo apt install -y libx11-dev libxt-dev libxext-dev libgl1-mesa-dev libglu1-mesa-dev
```

These are required for Coin3D, SoQt, and OpenGL support.

# 4. Clone the Tonatiuh++ Repository

Choose a working folder and clone the source:

```bash
    git clone https://github.com/CST-Modelling-Tools/tonatiuhpp.git
    cd tonatiuhpp
```
Project structure includes:

- `source/` – main code
- `build_deps.py` – dependency builder
- `CMakeLists.txt` – build configuration

# 5. Build Third-Party Dependencies

Tonatiuh++ uses Coin3D, SoQt, simage, and other libraries.

These are compiled automatically using the provided script:

```bash
    python3 build_deps.py
```

This step:

- downloads sources
- configures builds
- compiles the libraries
- installs them under `deps/install/`

It may take several minutes.

# 6. Configure the Tonatiuh++ Build with CMake

Create a build directory and run CMake:

```bash
    cmake -B build -S source \
      -DCMAKE_BUILD_TYPE=Release
```

CMake will:

- detect GCC
- detect Qt6 from system packages
- detect dependencies built in deps/install/

If configuration finishes successfully, you will see:

- “Configuring done”
- “Generating done”

# 7. Build the Application

Compile the project:

```bash
    cmake --build build --config Release --parallel
```

The final binary will be located at:

```bash
    build/application/tonatiuhpp
```

Make it executable (if needed):

```bash
    chmod +x build/application/TonatiuhXX
```

# 8. Running Tonatiuh++ on Ubuntu

Execute directly:

```bash
    ./build/application/TonatiuhXX
```

If Qt plugins or shared libraries are missing, install:

```bash
    sudo apt install -y qt6-wayland qt6-svg-dev qt6-5compat-dev
```

# 9. Optional: Install OpenGL for Better Rendering

Most Ubuntu systems already include Mesa drivers, but if not:

```bash
    sudo apt install -y mesa-utils
```

Test OpenGL:

```bash
    glxinfo | grep "OpenGL version"
```

# 10. Troubleshooting

## Qt6 not found
Ensure Qt6 CMake files exist:

```bash
    ls /usr/lib/x86_64-linux-gnu/cmake/Qt6/
```

If missing, reinstall Qt packages.

## Coin3D or SoQt build failures
Install additional X11/OpenGL headers:

```bash
    sudo apt install -y libxmu-dev libxi-dev freeglut3-dev
```

## CMake cannot find Python
Verify:

```bash
    python3 --version
    which python3
```

## Linking errors involving GL or X11
Install missing components:

```bash
    sudo apt install -y libgl1-mesa-dev libglu1-mesa-dev libx11-dev libxt-dev
```
# Summary

To build Tonatiuh++ on Ubuntu Linux:

1. Install build tools, Qt6, X11/OpenGL dependencies.
2. Clone the repository.
3. Build third-party libraries with build_deps.py.
4. Configure with CMake.
5. Compile the application.

Ubuntu offers one of the smoothest build environments for Tonatiuh++, and once configured, rebuilding is fast and reliable.

---
