---
slug: gow-installation-and-backends
title: "Installing GOW and Choosing a Backend"
authors: [mblanco]
tags: [gow, optimization, workflows, installation, fireworks, hpc]
description: A concise guide to installing GOW, using a dedicated Python environment, and choosing between local execution and the optional FireWorks backend.
keywords: [GOW, installation, FireWorks, backend, local execution, HPC]
image: /img/gow-social-card.jpg
---

# Installing GOW and Choosing a Backend

*A concise guide to package installation and execution backends*

This post covers two decisions that are separate from evaluator design:

- how to install GOW itself
- which execution backend to use

For evaluator environment strategy and `evaluator.command` guidance, see:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

For the workflow model behind runs and artifacts, see:

- **[GOW: Architecture, Evaluator Contract, and Provenance](/gow-architecture-and-usage)**

For a worked example of evaluator configuration, see:

- **[A 2D Benchmark Function Evaluator for the Generic Optimization Workflow](/2d-function-evaluator)**

<!-- truncate -->

---

## Install GOW in a Dedicated Python Environment

The recommended default is to install GOW in its own Python environment.

Example with `venv`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install .
```

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install .
```

If you plan to develop GOW itself, install it in editable mode:

```bash
pip install -e .[dev]
```

If you want to use the optional FireWorks backend:

```bash
pip install .[fireworks]
```

After installation, the `gow` CLI is available through the Python environment where GOW was installed. In normal usage, this means that the environment should be active before commands such as `gow run` or `gow evaluate` are used.

---

## Activating the GOW Environment

To ensure that the Python environment containing GOW is active, activate the same environment where GOW was installed.

Typical examples:

These examples assume that the current directory contains the `.venv` folder. If the environment is stored elsewhere, use the correct relative path or an absolute path to that environment.

- Linux or macOS:

```bash
source .venv/bin/activate
```

- Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

After activation, verify that the CLI is available:

```bash
gow --help
```

If this command works, the GOW environment is active and the `gow` CLI is available in the current shell session.

---

## Backend Choice

GOW supports two main execution modes:

- **local execution**
- **distributed execution with FireWorks**

### Local Execution

Use local execution when:

- you are developing an evaluator
- you are debugging a workflow
- evaluations run on a single machine
- you want the simplest setup

This is the right default for most early-stage work.

### FireWorks Execution

Use FireWorks when:

- evaluations need to run across multiple workers
- you already have workflow infrastructure for distributed execution
- you need scheduler integration on a cluster or HPC system

FireWorks is optional. It is not required for normal local usage.

---

## FireWorks Infrastructure

The FireWorks backend depends on external infrastructure, especially:

- a FireWorks installation
- a MongoDB database
- worker and launcher configuration

Typical FireWorks configuration files include:

- `my_launchpad.yaml`
- `my_fworker.yaml`
- `my_qadapter.yaml`

In many HPC environments, this infrastructure is already managed separately from GOW. In that case, GOW only needs the FireWorks Python extra and access to the existing FireWorks configuration.

---

## Keep the Concerns Separate

A common source of confusion is mixing three different decisions:

- where GOW is installed
- where the evaluator runs
- which backend dispatches evaluations

They are related, but they are not the same thing.

- GOW should usually live in its own Python environment.
- The evaluator may or may not share that environment.
- The backend determines how evaluations are dispatched, not what the evaluator runtime is.

For the evaluator-runtime decision, use the canonical guidance in:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

---

## Summary

Use a dedicated Python environment for GOW, start with the local backend unless you need distributed execution, and treat FireWorks as an infrastructure choice rather than part of the evaluator contract.
