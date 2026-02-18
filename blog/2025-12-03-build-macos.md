---
slug: build-macos
title: Building Tonatiuh++ on macOS
authors: mblanco
tags: [macos, build, development]
---

![Tonatiuh++ running on macOS](/img/tonatiuhxx-apple-screenshot.png)

macOS provides a clean and robust environment for building Tonatiuh++ thanks to its modern Clang compiler, strong UNIX foundations, and excellent package management through Homebrew. This guide describes the complete process for installing the necessary tools, building third-party dependencies, and compiling the Tonatiuh++ application on macOS Ventura, Sonoma, and newer.

<!-- truncate -->

# 1. Install Homebrew

If Homebrew is not installed, open Terminal and run:

```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation:

```bash
    brew update
```    

Homebrew will be used to install CMake, Python, Qt6, and development libraries.

# 2. Install Required Development Tools

Install the essential compiler and developer tools:

```bash
    xcode-select --install
```    

This provides:

- Apple Clang (C++17 compliant)
- macOS SDK
- Build utilities

Verify compiler:

```bash
    clang++ --version
```

You should see Apple Clang 14 or newer.

# 3. Install Build Dependencies via Homebrew

Install core tools needed for building Tonatiuh++:

```bash
    brew install cmake git python3
```

Optional but recommended tools:

```bash
    brew install ninja pkg-config
```

Ninja speeds up the build process but is not required.

# 4. Install Qt 6

Tonatiuh++ requires Qt 6.x for its graphical interface.

Install Qt via Homebrew:

```bash
    brew install qt@6
```

Qt will be installed at:

    /opt/homebrew/opt/qt@6        (Apple Silicon)
    /usr/local/opt/qt@6           (Intel Macs)

Add Qt to your PATH for convenience:

Apple Silicon:

```bash
    echo 'export PATH="/opt/homebrew/opt/qt@6/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
```

Intel Macs:

```bash
    echo 'export PATH="/usr/local/opt/qt@6/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
```    

Verify:

```bash
    qmake --version
    qtpaths --qt-version
```

# 5. Clone the Tonatiuh++ Repository

Navigate to the folder where you want the source code:

```bash
    git clone https://github.com/CST-Modelling-Tools/tonatiuhpp.git
    cd tonatiuhpp
```

# 6. Build Third-Party Dependencies

Tonatiuh++ uses Coin3D, SoQt, simage, and other support libraries.

They are automatically built via:

```bash
    python3 build_deps.py
```    

This may take time, especially on the first run.

If you encounter network SSL issues while downloading sources:

```bash
    pip3 install --upgrade certifi
```

# 7. Configure the Build with CMake

On macOS, Qt installed via Homebrew is discovered using CMake’s CMAKE_PREFIX_PATH.

Apple Silicon:

```bash
    cmake -B build -S source \
      -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_PREFIX_PATH="/opt/homebrew/opt/qt@6"
```

Intel Macs:

```bash
    cmake -B build -S source \
      -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_PREFIX_PATH="/usr/local/opt/qt@6"
```

CMake should detect:
- Clang
- Qt6
- Coin3D / SoQt from `deps/install/`

# 8. Build Tonatiuh++

Compile:

```bash
    cmake --build build --config Release --parallel
```

The final application will appear in:

```bash
    build/application/tonatiuhpp.app
```

You can launch it from Finder or by running:

```bash
    open build/application/TonatiuhXX.app
```

# 9. macOS Application Bundle Notes

macOS uses `.app` bundles that must include Qt plugins and frameworks.

If plugins are missing, you may see errors such as:

    This application failed to start because no Qt platform plugin could be initialized.

To fix this, use:

```bash
    macdeployqt build/application/TonatiuhXX.app
```

macdeployqt is included with the Qt installation.

# 10. Troubleshooting

## Qt not found
Check your Qt install location:

Apple Silicon:

```bash
    ls /opt/homebrew/opt/qt@6/
```

Apple Intel:

```bash
    ls /usr/local/opt/qt@6/
```

## CMake cannot find Qt
Pass the explicit prefix path:

```bash
    -DCMAKE_PREFIX_PATH=/opt/homebrew/opt/qt@6
```

## Missing OpenGL libraries
Install:

```bash
    brew install mesa
```

## build_deps.py failures
Make sure `requests` is installed:

```bash
    pip3 install requests
```

And verify Python:

```bash
    python3 --version
```

## Permission errors
If needed:
```bash
    chmod +x build/application/tonatiuhpp.app/Contents/MacOS/tonatiuhpp
```

# Summary

To build Tonatiuh++ on macOS:

1. Install Homebrew, developer tools, CMake, Git, Python.
2. Install Qt 6 using Homebrew.
3. Clone the Tonatiuh++ repository.
4. Build third-party dependencies with build_deps.py.
5. Configure using CMake with the Qt6 prefix path.
6. Build, then run the Tonatiuh++ application bundle.

macOS provides one of the smoothest build environments due to its native UNIX tooling and robust package ecosystem.

---