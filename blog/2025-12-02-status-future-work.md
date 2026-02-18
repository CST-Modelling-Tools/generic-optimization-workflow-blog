---
slug: status-and-future-work
title: Tonatiuh++ Current Status and Roadmap for Future Development
authors: mblanco
tags: [status, roadmap, development]
---

![Tonatiuh++ roadmap symbolic image](/img/tonatiuhpp-roadmap.png)

Tonatiuh++ began its development in **2018** within the framework of the *CySTEM ERA Chair* project at the Cyprus Institute. From the outset, it was conceived as a **Free and Open-Source Software (FOSS)** project and as an enhanced successor to the original Tonatiuh ray tracer.
<!-- truncate -->
The original Tonatiuh code has a long and diverse history. I first developed it under contract with NREL while serving as Director of the Engineering Department at the University of Texas at Brownsville in the United States. When I later returned to Spain and joined CENER—the National Renewable Energy Center—I continued its development while establishing and directing its Solar Thermal Department. After my departure from CENER to direct the Australian Solar Thermal Research Initiative at CSIRO in Australia, CENER continued leading Tonatiuh’s evolution, a role it still maintains today.

---

## Why Tonatiuh++ Was Created

While at the Cyprus Institute, I recognized that the original Tonatiuh had become increasingly difficult to extend without breaking backward compatibility with existing applications. Tonatiuh++ was therefore envisioned as a **clean evolution**, built on the original Tonatiuh code base but modernized without the constraint of preserving compatibility with legacy scripts and documents.

During the CySTEM project, **Dr. Victor Grigoriev** served as the lead developer. His contributions significantly enhanced both the functionality and computational performance of the software. Unfortunately, CYI was unable to retain Dr. Grigoriev after the project ended, and he subsequently left academia. Combined with personal circumstances that required me to step down as ERA Chair, this led to a period of reduced development activity for Tonatiuh++.

---

## Resuming Development

My recent return to CIEMAT as a Distinguished Researcher, within the framework of the **ATRAE program** of the Spanish State Research Agency, has created the right conditions to resume and lead Tonatiuh++ development. As Principal Investigator of the project *“Towards disruptive innovation in advanced solar energy systems through artificial intelligence and high performance computing,”* I now have both the opportunity and the responsibility to push Tonatiuh++ forward.

A foundational objective is to ensure that Tonatiuh++ runs natively on **all major operating systems**. While previous work focused mainly on Windows, my intention is to restore and guarantee full support for:

- **Windows 11**
- **Linux**
- **macOS**

Achieving robust cross-platform building and execution is the first decisive step.

---

## Short-Term Roadmap

### 1. Restore cross-platform build and execution  
Ensure Tonatiuh++ can be built cleanly from the source code and run natively on Windows, Linux, and macOS using modern toolchains.

### 2. Establish a professional CI/CD workflow  
Deploy a GitHub-based continuous integration and continuous development pipeline to automate building, testing, and packaging.

### 3. Repair the software update mechanism  
The prior self-update system ceased to function when CYI discontinued the Bitbucket server hosting update metadata. Restoring this capability is a priority.

### 4. Provide a professional installer and distribution options  
Enable users to choose between building from source or installing precompiled binaries through a reliable installer.

### 5. Introduce benchmarking capabilities  
Define appropriate benchmarks to evaluate performance, guide improvements, and quantify software advancements.

---

## Target Timeline

My objective is to complete these foundational restoration and infrastructure tasks by **January 2026**, potentially earlier if additional collaborators join the effort.

Once these steps are achieved, the development focus will shift from infrastructure to **innovation**, enabling the introduction of new features and capabilities that will expand the analytical and simulation capabilities of Tonatiuh++.

---
