---
slug: build-windows
title: "Building Tonatiuh++ on Windows 11"
authors: mblanco
tags: [windows, build, development]
---

![Tonatiuh++ running on Windows 11](/img/tonatiuhxx-windows-screenshot.png)

Building **Tonatiuh++** from source on **Windows 11** requires installing a small set of development tools and third-party libraries, building additional dependencies using the build scripts included in this repository, configuring the project with CMake, and finally installing it so that all runtime dependencies are correctly resolved.

This guide describes a **command-line–only workflow**, without relying on IDE integration. All build steps are executed using the **MSVC x64 toolchain**.

<!-- truncate -->

Before starting, make sure the following software is installed on your system:

- **Python ≥ 3.9** (required to run the dependency build and diagnostic scripts)
- **Git** (required to clone the repository and fetch third-party sources)
- **CMake ≥ 3.20** (required to configure and build the project)
- **Visual Studio Community Edition** with the **MSVC x64 C++ toolchain**
- **Qt 6 (MSVC x64 build)**  
- **Eigen** (header-only linear algebra library)
- **Boost** (C++ utility libraries)

## Required tools

### Installing Python

Python is required to run the dependency build and diagnostic scripts used by Tonatiuh++.

#### Install Python

1. Download the official Windows installer from: https://www.python.org/downloads/windows/

![Python download webpage](/img/python-3-14-2-installation-01.jpeg)

2. From the section "Stable Releases" Choose **Python 3.9 or newer** (64-bit) and download it using either "Python install manager" or "Windows installer (64 bit)".

![Python install manager](/img/python-3-14-2-installation-02.jpeg)

3. Run the installer and **enable the option “Add Python to PATH”** before starting the installation.

![Adding Python to the PATH](/img/python-3-14-2-installation-03.jpeg)

4. Complete the installation using the default options.

![Finalizing Python installation with default options](/img/python-3-14-2-installation-04.jpeg)

#### Verify the installation

Open a new **Command Prompt** or **PowerShell** window and run:

```bash
python --version
```

If Python is correctly installed, you should see an output similar to:

```text
Python 3.14.2
```
On some systems, Python may be invoked using `python3` instead:

```bash
python3 --version
```

If neither command is found, ensure that Python is installed and that its installation directory is included in your system `PATH`.

### Installing Git

Git is required to clone the Tonatiuh++ repository and to fetch third-party sources during the build process.

#### Install Git

1. Download the official Git for Windows installer from: https://git-scm.com/download/win

![Git download webpage](/img/git-2-52-0-installation-01.jpeg)

2. Run the installer and follow the default installation options. The default settings are sufficient for building Tonatiuh++.

![Git installer first screen](/img/git-2-52-0-installation-02.jpeg)

3. During installation, make sure that Git is added to your **PATH**  
   (this is the default and recommended option).

#### Verify the installation

Open a new **Command Prompt** or **PowerShell** window and run:

```bash
git --version
```

If Git is correctly installed, you should see an output similar to:

```text
git version 2.52.0.windows.1
```

If the command is not found, ensure that Git is installed and that its `bin` directory is included in your system `PATH`.

### Installing CMake

CMake is required to configure and build Tonatiuh++ and its third-party dependencies. A sufficiently recent version is mandatory.

#### Install CMake

1. Download the official Windows installer from: https://cmake.org/download/

![CMake download webpage](/img/cmake-4-2-1-installation-01.jpeg)

2. Choose the **Windows x64 Installer** (`cmake-<version>-windows-x86_64.msi`).

![CMake installer first screen](/img/cmake-4-2-1-installation-02.jpeg)

3. Run the installer and follow the default installation options.

4. When prompted, select the option to **add CMake to the system PATH for all users**  
   (or at least for the current user).

#### Verify the installation

Open a new **Command Prompt** or **PowerShell** window and run:

```bash
cmake --version
```

If CMake is correctly installed, the first line of the output should indicate a version **greater than or equal to 3.20**, for example:

```text
cmake version 4.2.1
```

If the command is not found, ensure that CMake is installed and that its installation directory is included in your system `PATH`.


### Installing Visual Studio Community Edition (MSVC x64)

Visual Studio Community Edition provides the **Microsoft Visual C++ (MSVC) x64 toolchain**, which is required to compile Tonatiuh++ and all native third-party dependencies on Windows.

#### Install Visual Studio Community Edition

1. Download the installer from the official Visual Studio website: https://visualstudio.microsoft.com/vs/community/

![Visual Studio Community download webpage](/img/vsc-2026-installation-01.jpeg)

2. Run the installer. When prompted to select workloads, enable:

   - **Desktop development with C++**

![CMake installer first screen](/img/vsc-2026-installation-02.jpeg)

4. Complete the installation and allow Visual Studio to download and install all selected components.

#### Verify the installation

After installation, open the **x64 Native Tools Command Prompt**  
(from the Start Menu) and run:

```bash
cl
```

If the MSVC compiler is correctly installed, you should see output indicating the compiler version, ending with a message similar to:

```text
Microsoft (R) C/C++ Optimizing Compiler Version 19.50.35720 for x64
Copyright (C) Microsoft Corporation.  All rights reserved.

usage: cl [ option... ] filename... [ /link linkoption... ]
```

If the command is not found, ensure that:
- Visual Studio Community Edition is installed,
- the **Desktop development with C++** workload is enabled, and
- you are using the **x64 Native Tools** command prompt.

### Installing Qt 6 (MSVC x64)

Qt 6 is required to build and run the Tonatiuh++ graphical user interface.  
On Windows, Qt **must** be built with the same compiler as the application, i.e. **MSVC x64**.

#### Install Qt

1. Download the **Qt Online Installer** from: https://www.qt.io/download-qt-installer

![Qt Installer download webpage](/img/qt-installation-01.jpeg)

2. Run the installer and sign in with a Qt account when prompted.

3. When selecting components, expand the latest available **Qt 6.x** version and select:

   - **msvc2022_64**

   Other components (sources, Android, MinGW, etc.) are not required.

![Qt installation selection](/img/qt-installation-02.jpeg)

4. Complete the installation.

By default, Qt is installed under a path similar to:

```text
C:\Qt\6.10.1\msvc2022_64
```
#### Verify the Qt installation

Check that the Qt installation directory exists and contains the expected subdirectories, in particular:

```text
C:\Qt\6.10.1\msvc2022_64\bin
C:\Qt\6.10.1\msvc2022_64\lib
C:\Qt\6.10.1\msvc2022_64\lib\cmake\Qt6
```

The presence of 'lib\cmake\Qt6' confirms that CMake can locate Qt correctly.

Qt does **not** need to be added manually to the system PATH. The build scripts and CMake configuration will locate it automatically.

### Installing Eigen

Eigen is a header-only C++ library used by Tonatiuh++ for linear algebra operations.

#### Install Eigen

1. Download Eigen from the official website: https://libeigen.gitlab.io/

![Eigen download webpage](/img/eigen-installation-01.jpeg)

2. Extract the downloaded archive to a convenient location, for example:

```text
C:\eigen-5.0.0
```

No compilation or installation step is required.

#### Verify the installation

Check that the Eigen directory contains the following path:

```text
C:\eigen-5.0.0\Eigen\src\Core
```

If this directory exists, Eigen is correctly installed.

Eigen does **not** need to be added to the system `PATH`. If Eigen is installed in a non-standard location, its path can be provided later to the build scripts.

### Installing Boost

Boost provides a collection of C++ libraries required by some Tonatiuh++'s third-party dependencies.

#### Install Boost

1. Download Boost from the official website: https://www.boost.org/users/download/

![Boost download webpage](/img/boost-1-90-0-installation-01.jpeg)

2. Choose a recent Boost release compatible with MSVC and extract it to a location such as:

```text
C:\boost_1_90_0
```

No further installation step is required if Boost headers are available.

#### Verify the installation

Check that the Boost directory contains the following header file:

```text
C:\boost_1_90_0\boost\version.hpp
```

The presence of this file confirms that Boost headers are available.

Boost does **not** need to be added to the system `PATH`. If Boost is installed in a non-standard location, its path can be provided later to the build scripts.

## Opening the MSVC x64 Build Environment

All build commands for Tonatiuh++ must be executed from an environment where the **MSVC x64 compiler** and associated tools are correctly configured.

### Open the MSVC x64 Native Tools Command Prompt

From the **Start Menu**, open:

> **x64 Native Tools Command Prompt (Visual Studio)**

This command prompt initializes the environment variables required to use the MSVC x64 toolchain.

When opened successfully, you should see output similar to:

```bash
[vcvarsall.bat] Environment initialized for: 'x64'
```
### Verify the compiler

In the same command prompt, run:

```bash
cl
```
If the environment is correctly configured, the MSVC compiler will respond with output similar to:

```bash
Microsoft (R) C/C++ Optimizing Compiler Version 19.50.35720 for x64
Copyright (C) Microsoft Corporation.  All rights reserved.

usage: cl [ option... ] filename... [ /link linkoption... ]
```
If cl is not found, ensure that:

- Visual Studio Community Edition is installed,
- the Desktop development with C++ workload is enabled, and
- you are using the x64 Native Tools Command Prompt, not a regular command prompt.

## Clone the repository

Git is required to download the Tonatiuh++ source code and its third-party dependencies.

Choose a working folder (example below uses the user profile) and clone the repository:

```bash
cd "%USERPROFILE%"
git clone --recurse-submodules https://github.com/CST-Modelling-Tools/tonatiuhpp.git
cd tonatiuhpp
```

If you already cloned the repository *without* submodules, you can initialize them with:

```bash
git submodule update --init --recursive
```

After cloning, you should have a folder structure that includes at least:

```text
scripts\
source\
third_party\
```

If everything looks correct, proceed to building third-party dependencies.

## Building third-party dependencies

### Build dependencies

Tonatiuh++ relies on several third-party libraries (such as Coin3D, simage, and SoQt) that are built locally using a Python script included in this repository.

All commands in this section must be executed from the **MSVC x64 Native Tools Command Prompt**.

---

### Run the dependency build script

From the root of the Tonatiuh++ repository, execute:

```bash
python scripts\build_deps.py
```

The script automatically:

- detects **Qt**, **Boost**, and **Eigen** on your system,
- clones and builds **Coin3D**, **simage**, and **SoQt**,
- installs the resulting libraries under `third_party\_install`,
- generates CMake dependency hint files for later configuration,
- verifies each dependency before proceeding.

The build process may take several minutes, depending on your system.

### Installing PyYAML (if required)

On Windows, Python installations often do **not** include PyYAML by default. If the script stops with a message indicating that **PyYAML** is missing, install it using:

```bash
python -m pip install --upgrade pip
python -m pip install pyyaml
```
> **Important**  
> Do **not** use `pip install ...` directly. On Windows, `pip` is not always available as a standalone command.  
> Always invoke it via `python -m pip`.

A successful installation will produce output similar to:

```text
Collecting pyyaml
  Downloading pyyaml-6.0.3-cp314-cp314-win_amd64.whl.metadata (2.4 kB)
Downloading pyyaml-6.0.3-cp314-cp314-win_amd64.whl (156 kB)
Installing collected packages: pyyaml
Successfully installed pyyaml-6.0.3

```
After installing PyYAML, rerun:

```bash
python scripts\build_deps.py
```

### If Python fails before the script runs

If Python exits immediately with an error such as:

```text
Fatal Python error: Failed to import encodings module
```

this indicates a **broken Python environment**, usually caused by incorrectly set environment variables.

Before retrying, ensure that the following environment variables are **not set**:

- `PYTHONHOME`
- `PYTHONPATH`

You can check this quickly with:

```bash
set PYTHONHOME
set PYTHONPATH
```

If either variable is defined, the content of the variable will be printed on the terminal. Should that be the case, remove the variable from your **User** and **System** environment variables, close the current terminal, open a new one, and retry the build script.

---

If the dependency build completes without errors, you can proceed to configuring and building Tonatiuh++ itself.


### Optional: diagnose configuration issues

To verify your environment or troubleshoot failures, you can run:

```bash
python scripts\build_deps.py --doctor
```

This diagnostic mode checks for missing tools and libraries, validates the MSVC x64 environment, and reports common Windows configuration issues.

### Expected output

After a successful run, the following directory should exist:

```text
third_party\_install
```

This directory contains all locally built third-party dependencies and will be used automatically during the CMake configuration step.

If the dependency build completes without errors, you can proceed to configuring Tonatiuh++.

### Building dependencies for Debug (Windows)

On Windows, a **Debug** build of Tonatiuh++ must link against **Debug** builds of the third-party libraries (Coin3D, SoQt, simage).  
These libraries typically produce debug import libraries with a `d` suffix (for example `SoQt1d.lib`), so building Tonatiuh++ in Debug will fail if the dependencies were built only in Release.

To build the third-party dependencies in **Debug**, run:

```bash
python scripts\build_deps.py --config Debug
```

After this completes successfully, you can configure and build Tonatiuh++ in Debug.

## Configuring Tonatiuh++ with CMake

After cloning the repository and building the third-party dependencies, you can configure Tonatiuh++ using CMake.

All commands in this section must be executed from the **MSVC x64 build environment** opened previously.

### Option A: Configure with the default CMake generator

To configure Tonatiuh++, execute the following cmake statement:

```bash
cmake -S source -B build
```

CMake will automatically select an appropriate generator based on your environment. CMake will print a summary and finish with messages similar to:

```bash
-- Configuring done (8.2s)
-- Generating done (2.5s)
-- Build files have been written to: C:/.../tonatiuhpp/build
```

If the `build` directory does not exist, CMake will create it automatically.

### Option B: Configure with Ninja

If Ninja is installed and available on your `PATH`, you can explicitly request it:

```bash
cmake -S source -B build -G Ninja
```

When using Ninja, you may also specify the build type at configure time (for example `-DCMAKE_BUILD_TYPE=Release`).

### Notes about dependency discovery

You do **not** need to set `CMAKE_PREFIX_PATH` manually.

The project automatically discovers all required dependencies using:

- `third_party\_install`
- `cmake\LocalDepsHints.cmake` (generated by `scripts\build_deps.py`)

If configuration completes successfully, you can proceed to building Tonatiuh++ using the same build directory.

## Building and Installing Tonatiuh++

After configuring the project with CMake, you can build and install Tonatiuh++.

All commands in this section must be executed from the **same build environment** used during configuration.

### Build the project

If you configured with a multi-configuration generator, build Release with:

```bash
cmake --build build --config Release
```

If you configured with Ninja (single-configuration), build with:

```bash
cmake --build build
```

### Install the project

For multi-configuration generators:

```bash
cmake --install build --config Release
```

For Ninja (single-configuration):

```bash
cmake --install build
```
### Installation location

By default, Tonatiuh++ is installed into a user-local directory defined during configuration. After installation, the executable, libraries, and resources will be placed under that installation prefix.

If the installation completes without errors, Tonatiuh++ is ready to run. On Windows you can run it by going to the "installation" folder, locate within it the "bin" folder, find within it the program tonatiuhpp.exe, and left-click on it twice.

### Building a Debug configuration

To build Tonatiuh++ in **Debug**, make sure you have built the third-party dependencies in Debug first:

```bash
python scripts\build_deps.py --config Debug
```

Then build and install the Debug configuration:

```bash
cmake --build build --config Debug
cmake --install build --config Debug
```

## Summary

In this guide, you have built and installed **Tonatiuh++** from source on **Windows 11** using a fully command-line workflow.

The main steps were:

- Install the required tools and libraries: **Python**, **Git**, **CMake**, **Visual Studio Community Edition (MSVC x64)**, **Qt 6**, **Eigen**, and **Boost**
- Clone the Tonatiuh++ repository
- Build the required third-party dependencies using the provided Python script
- Configure the project with CMake
- Build and install Tonatiuh++

At any point, you can use the diagnostic command:

```bash
python scripts\build_deps.py --doctor
```

to verify your environment and identify missing or misconfigured components.

After installation, Tonatiuh++ can be launched from the installation directory and is ready for use.

This workflow ensures a clean, reproducible build using a user-local installation, without requiring administrative privileges or IDE integration.