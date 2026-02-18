---
slug: build-overview
title: 'Building Tonatiuh++ from Source: A Cross-Platform Overview'
authors: mblanco
tags: [build, development, overview]
---

<div className="slideshow">
  <img src="img/tonatiuhxx-windows-screenshot.png" alt="Tonatiuh++ on Windows" />
  <img src="img/tonatiuhxx-apple-screenshot.png" alt="Tonatiuh++ on macOS" />  
  <img src="img/tonatiuhxx-ubuntu-linux-screenshot.png" alt="Tonatiuh++ on Linux" />
</div>

Tonatiuh++ is designed as a modern, cross-platform Free and Open-Source Software project. One of its foundational goals is to support native builds on the three major operating systems used in scientific and engineering environments: **Windows 11**, **Linux**, and **macOS**.

Because of this, the Tonatiuh++ build system has been deliberately structured to rely on open technologies—**CMake**, **C++17**, and widely available external libraries—ensuring that users and developers can compile the software directly from the source code regardless of their platform of choice.

<!-- truncate -->

This post provides a **general overview** of the build process and the required components. Detailed step-by-step instructions for each operating system are provided in separate posts.

---

## Why Building From Source Matters

Building Tonatiuh++ from source offers several advantages:

- It enables developers to contribute to the project, debug issues, or explore the internal architecture.
- It allows users to configure the build process for their own hardware, compilers, or research workflows.
- It ensures reproducibility and transparency in scientific and engineering applications.
- It removes dependency on precompiled binaries, which may lag behind active development.

As development progresses, ensuring a stable and well-defined source-build path is central to the long-term sustainability of Tonatiuh++.

---

## Core Build Dependencies

Tonatiuh++ relies on a set of well-established libraries and tools. While the exact installation steps differ among operating systems, the overall dependency structure is consistent:

### 1. CMake

The build system is entirely based on CMake, which orchestrates dependency detection, compilation, linking, and IDE integration.

### 2. A Modern C++ Compiler

Tonatiuh++ requires a compiler with solid C++17 support. Examples include:

- MSVC (Windows)
- GCC or Clang (Linux)
- Apple Clang (macOS)

### 3. Qt 6

Qt provides the graphical user interface and is required to build the Tonatiuh++ application. The build system assumes a Qt 6 installation available on the system.

### 4. Eigen

A lightweight, header-only linear algebra library used extensively within the core ray-tracing algorithms.

### 5. Coin3D and SoQt

These libraries form the 3D graphics and interaction layer. They are built automatically as part of the Tonatiuh++ third-party dependency system.

Coin3D have been modified specifically for Tonatiuh++. Thus, it should be build from the [coin4tonatiuhpp](https://github.com/CST-Modelling-Tools/coin4tonatiuhpp) repository of the CST-Modelling-Tools GitHub organization and not from the original repository of the Coin3D softare.

All third-party dependencies except Qt are built using an automated Python script included in the source tree.

---

## The Build Workflow in Summary

Regardless of platform, building Tonatiuh++ follows the same conceptual workflow:

### 1. Clone the repository

```bash
    git clone https://github.com/CST-Modelling-Tools/tonatiuhpp.git
    cd tonatiuhpp
```

### 2. Build third-party dependencies

The script `build_deps.py` automates the process of building Coin3D, SoQt, simage, and other dependencies.

```bash
    python3 build_deps.py
```    

This step may take some time depending on the system.

### 3. Configure the build with CMake

```bash
    cmake -B build -S source -DCMAKE_BUILD_TYPE=Release
```
On Windows, CMake will use the Visual Studio 2022 generator automatically.

### 4. Build Tonatiuh++

```bash
    cmake --build build --config Release
```

The final executable will be available under the `build/application/` directory.

---

## Platform-Specific Guides

Because each operating system has its own package managers, compiler conventions, and environment variables, the following posts provide in-depth instructions for each case:

- **[How to build Tonatiuh++ from source on Windows 11](/tonatiuhpp-blog/build-windows)**
- **[How to build Tonatiuh++ from source on Ubuntu Linux](/tonatiuhpp-blog/build-linux)**
- **[How to build Tonatiuh++ from source on macOS](/tonatiuhpp-blog/build-macos)**

These platform-specific posts cover:

- Installing Qt  
- Installing compilers and build tools  
- Running `build_deps.py`  
- Resolving path and environment issues  
- Running the resulting executable  

---

## Looking Ahead

As Tonatiuh++ development accelerates, one of the key goals is to streamline the build process even further by:

- Providing prebuilt installers 
- Integrating continuous integration pipelines 
- Improving platform packaging
- Ensuring long-term reproducibility of builds

In the meantime, building from source remains the most reliable way to obtain the latest version of Tonatiuh++ and participate in its development.

---
