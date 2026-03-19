---
slug: running-gow-with-external-evaluators
title: "Running GOW with External Evaluators on Windows, Linux, and macOS"
authors: [mblanco]
tags: [gow, optimization, workflows, evaluators, windows, linux, macos]
description: Canonical guidance for installing GOW, choosing evaluator environments, writing evaluator commands, and running evaluators correctly on Windows, Linux, and macOS.
keywords: [GOW, evaluator.command, python environment, windows, linux, macOS, external evaluators]
image: /img/gow-social-card.jpg
---

# Running GOW with External Evaluators on Windows, Linux, and macOS

*Canonical setup guidance for evaluator execution*

GOW is designed to launch **external evaluators**. That flexibility is one of its strengths, but it also means users need a clear answer to a practical question:

**Which environment actually runs the evaluator?**

The answer depends on how `evaluator.command` is written.

`evaluator.command` is the field in the GOW optimization specification YAML that tells GOW which process to launch for each evaluation. Typical examples are:

- `["{python}", "evaluator.py"]`
- `["C:/Tools/evaluator/bin/evaluator.exe"]`
- `["bash", "/abs/path/to/run-evaluator.sh"]`

This post is the canonical reference for:

- where GOW should be installed
- when evaluators should share GOW's environment
- when evaluators should use separate environments
- when to use `{python}`
- when to use a direct executable path
- when to use wrapper scripts
- OS-specific guidance for Windows, Linux, and macOS

Short answer:

- Install **GOW** in its own Python environment.
- Use **`{python}`** only when the evaluator should run in that same environment.
- Use a **direct executable path** for compiled or self-contained evaluators.
- Use a **wrapper script** when the evaluator needs activation, module loading, or other setup.

One more point is essential:

- GOW defines the optimization process.
- The evaluator may also have its own internal configuration, auxiliary files, or workflow specification.

For the underlying execution model, see:

- **[GOW: Architecture, Evaluator Contract, and Provenance](/gow-architecture-and-usage)**

For the structure of the optimization specification itself, see:

- **[Defining and Running an Optimization Problem in GOW](/defining-and-running-an-optimization-problem)**

For package installation and backend selection, see:

- **[Installing GOW and Choosing a Backend](/gow-installation-and-backends)**

For a concrete worked example, see:

- **[A 2D Benchmark Function Evaluator for the Generic Optimization Workflow](/2d-function-evaluator)**

<!-- truncate -->

---

## The Default Recommendation

Install **GOW itself** in a **dedicated Python environment**.

That environment should contain:

- GOW
- the Python packages required by GOW
- any GOW backend extras you intend to use

This is the safest default because it keeps GOW's own dependencies stable and avoids coupling workflow orchestration to evaluator-specific packages.

In most projects, the clean mental model is:

- one Python environment for **GOW**
- one execution target for each **evaluator**

Those two may be the same, but they do not have to be.

If you have not read the architecture post yet, the important context is:

- the optimization problem is defined in a user-owned YAML specification
- that specification contains the evaluator section
- `evaluator.command` inside that section is what determines the evaluator runtime

---

## Two Layers of Configuration

In simple cases, one GOW problem specification is enough. In more complex scientific workflows, there are often **two layers**:

1. the **GOW optimization specification**
2. the **evaluator's own configuration or workflow specification**

The GOW optimization specification defines what GOW must understand and track, such as:

- the optimization objective
- the parameters visible to the optimization process
- how to launch the evaluator
- runtime settings relevant to orchestration

The evaluator may also need its own files, such as:

- templates
- meshes
- lookup tables
- calibration data
- workflow YAML files
- solver-chain configuration
- post-processing rules

That second layer belongs to the evaluator, not to GOW.

GOW does **not** require every evaluator input to be flattened into `input.json`.

---

## What Should Go Into `input.json`?

`input.json` should contain the information GOW hands to the evaluator as part of the tracked evaluation state.

This usually includes:

- candidate-specific parameter values
- fixed problem settings that should be tracked as part of the optimization state
- run and candidate identifiers
- small pieces of metadata that should travel with the evaluation

Other evaluator inputs may live outside `input.json`. That is often the better choice for:

- large datasets
- structured workflow descriptions
- domain-specific templates
- files consumed by multiple tools inside the evaluator
- internal evaluator configuration that GOW does not need to interpret

There is no universal rule that cleanly separates “parameter,” “metadata,” and “auxiliary input” for every workflow. The practical rule is simpler:

- if GOW should track it as part of the problem or candidate state, keep it GOW-visible
- if it is evaluator-internal or too domain-specific for GOW to model, keep it in evaluator-owned files

---

## Where Should Evaluator Data Live?

Static evaluator inputs should normally live in the **user workspace**, not inside the GOW installation and not inside the Python environment.

Typical examples:

- reference datasets
- templates
- geometry files
- model inputs
- evaluator workflow YAML files

Per-evaluation generated files belong in GOW's run/output directories. Static evaluator assets belong in problem-specific directories that the evaluator can read.

In other words:

- GOW installation: GOW itself
- user workspace: problem definitions and evaluator-owned static inputs
- run output directories: candidate-specific generated artifacts

---

## Which Environment Is Used During a Run?

During an optimization run, GOW launches the evaluator as a child process using `evaluator.command`.

That means:

- the evaluator process starts from the GOW process context
- environment variables from the GOW process are inherited by default
- `evaluator.env` can add or override variables for the evaluator process
- the actual runtime used by the evaluator is determined by the command you configure

So the practical rule is:

- if `evaluator.command` uses `{python}`, the evaluator runs in **GOW's Python environment**
- if `evaluator.command` points to an executable, the evaluator runs as **that executable**
- if `evaluator.command` invokes a wrapper script, the evaluator runs in **the environment selected by that wrapper**

This is why `evaluator.command` is the key decision point.

It is also why complex evaluators often use wrappers or entry-point scripts: the command may need to bootstrap a workflow that reads its own configuration files in addition to GOW's `input.json`.

---

## Decision Table

| Situation | Recommended setup | `evaluator.command` pattern | Why |
|---|---|---|---|
| Small Python evaluator, dependencies already match GOW | Share GOW's environment | `["{python}", "evaluator.py"]` | Smallest and clearest setup |
| Python evaluator with conflicting or heavy dependencies | Separate evaluator environment | wrapper script or explicit interpreter path | Keeps GOW isolated |
| Compiled executable or vendor binary | Keep GOW separate; call the binary directly | `["/abs/path/to/evaluator"]` or `["C:/path/to/evaluator.exe"]` | No Python coupling is needed |
| Evaluator needs activation, modules, or multiple setup steps | Wrapper script | explicit shell or script host | Makes setup reproducible |
| Plotting or analysis tools are optional | Choose separately from evaluator runtime | same environment or separate analysis environment | Analysis tooling is not the evaluator runtime |

---

## When Evaluators Should Share GOW's Environment

Using the same environment is appropriate when all of the following are true:

- the evaluator is written in Python
- it is lightweight
- its dependencies are already compatible with GOW
- there is no operational reason to isolate it

In that case, use:

```yaml
evaluator:
  command: ["{python}", "evaluator.py"]
```

`{python}` resolves to the Python interpreter used to launch GOW. In other words, it binds the evaluator to the same interpreter as the `gow` CLI.

This is the right default for:

- toy examples
- simple reference evaluators
- small internal tools
- early development before dependency complexity appears

---

## When Evaluators Should Use Separate Environments

Use a separate evaluator environment when any of the following apply:

- the evaluator needs packages that conflict with GOW's dependencies
- the evaluator depends on a large scientific stack that should not be installed into the GOW environment
- the evaluator is distributed as a compiled tool or vendor binary
- the evaluator depends on external software, modules, licenses, or shell initialization
- the evaluator runs on worker machines with an environment managed outside Python

Typical examples:

- a Python evaluator with a large ML or simulation stack
- a compiled solver
- a vendor tool launched through a shell wrapper
- an HPC workflow that loads modules before running the executable

In these cases, do **not** force the evaluator into the GOW environment just because GOW started the run.

---

## How to Write `evaluator.command`

`evaluator.command` should describe the exact process GOW must launch.

Use one of three patterns.

### 1. Use `{python}` for Python Evaluators in GOW's Environment

```yaml
evaluator:
  command: ["{python}", "evaluator.py"]
```

Use this when:

- the evaluator is Python
- it should run in the same environment as GOW

Do not use `{python}` when the evaluator is supposed to run in a different environment.

Avoid this pattern if the real runtime is another Python environment. In that case, use an explicit interpreter path or a wrapper.

### 2. Use a Direct Executable Path for Native or Self-Contained Evaluators

```yaml
evaluator:
  command: ["/opt/my-evaluator/bin/evaluator"]
```

Windows example:

```yaml
evaluator:
  command: ["C:/Tools/MyEvaluator/bin/evaluator.exe"]
```

Use this when:

- the evaluator is a compiled executable
- the evaluator already encapsulates its own runtime requirements
- no activation step is needed

Absolute paths are preferable for reproducibility.

This is also a good pattern when the executable reads auxiliary files from a problem-specific workspace.

### 3. Use a Wrapper Script When Setup Is Part of the Runtime

Use a wrapper when the evaluator needs setup that should happen every time it runs, such as:

- activating another environment
- loading modules
- exporting environment variables
- changing working assumptions before launch

Examples:

- Linux or macOS:

```yaml
evaluator:
  command: ["bash", "/abs/path/to/run-evaluator.sh"]
```

- Windows with `cmd.exe`:

```yaml
evaluator:
  command: ["cmd.exe", "/c", "C:\\path\\to\\run-evaluator.cmd"]
```

- Windows with PowerShell:

```yaml
evaluator:
  command: ["powershell", "-ExecutionPolicy", "Bypass", "-File", "C:\\path\\to\\run-evaluator.ps1"]
```

Wrapper scripts are the best option when environment activation is necessary. They keep the logic explicit and out of the YAML file.

Do not try to encode multi-step shell logic directly in the YAML command list. Put it in the wrapper.

They are also the best option when the evaluator is itself a workflow driver that needs to read an evaluator-specific YAML or similar configuration file.

Example:

```yaml
evaluator:
  command: ["bash", "/abs/path/to/run-evaluator.sh"]
```

Inside `run-evaluator.sh`, the evaluator can invoke its own workflow definition, for example:

```bash
/opt/evaluator/bin/driver --spec /abs/path/to/problem/evaluator.yaml
```

---

## `evaluator.env` vs Separate Environments

Use `evaluator.env` for **small runtime adjustments**, not for full environment activation.

Good uses:

```yaml
evaluator:
  command: ["{python}", "evaluator.py"]
  env:
    OMP_NUM_THREADS: "1"
    MKL_NUM_THREADS: "1"
```

That is appropriate for:

- controlling thread counts
- passing a license server hostname
- toggling evaluator behavior with environment variables

It is **not** a substitute for:

- switching Python interpreters
- activating a conda environment
- loading a module stack
- reproducing a long shell setup sequence

If the runtime needs real setup, use a wrapper script.

---

## Windows Guidance

On Windows, the main concerns are executable resolution, path handling, and explicit shell invocation.

### Recommended Patterns

- Use absolute paths for evaluator executables whenever possible.
- Prefer `.exe` for direct executables.
- If you need a script, invoke its interpreter explicitly.
- Use forward slashes in YAML paths when convenient, since they reduce escaping noise.
- Prefer absolute paths over `PATH` lookup.

Good examples:

```yaml
evaluator:
  command: ["C:/Tools/evaluator/bin/evaluator.exe"]
```

```yaml
evaluator:
  command: ["{python}", "evaluator.py"]
```

```yaml
evaluator:
  command: ["cmd.exe", "/c", "C:\\workflows\\run-evaluator.cmd"]
```

```yaml
evaluator:
  command: ["powershell", "-ExecutionPolicy", "Bypass", "-File", "C:\\workflows\\run-evaluator.ps1"]
```

### When to Use a Wrapper on Windows

Use a wrapper when you need to:

- activate a separate Python or conda environment
- prepare PATH entries for vendor tools
- set license-related variables
- run a multi-step launch sequence

### Common Windows Notes

- Do not assume `.ps1` files will execute directly without `powershell` or `pwsh`.
- Do not rely on a manually activated terminal session as part of reproducibility.
- Be careful with spaces in paths; list-form commands are preferable to shell-assembled strings.
- Do not use backslashes in double-quoted YAML strings unless you intend to escape them.

---

## Linux Guidance

On Linux, the main concerns are executable permissions, shebangs, modules, and stable paths.

### Recommended Patterns

- Use absolute paths to evaluator executables.
- Use `{python}` only when the evaluator belongs in GOW's Python environment.
- If using shell setup, prefer an explicit wrapper script.
- Prefer a wrapper over shell fragments embedded in scheduler commands.

Good examples:

```yaml
evaluator:
  command: ["/opt/evaluators/my-evaluator/bin/evaluator"]
```

```yaml
evaluator:
  command: ["bash", "/opt/evaluators/my-evaluator/run-evaluator.sh"]
```

```yaml
evaluator:
  command: ["/opt/venvs/evaluator/bin/python", "/opt/workflows/evaluator.py"]
```

### When to Use a Wrapper on Linux

Use a wrapper when you need to:

- activate a separate virtual environment or conda environment
- load `module` definitions on a cluster
- stage files before execution
- call multiple tools in sequence before the final evaluator

### Common Linux Notes

- Do not assume a relative path will resolve the same way across workspaces.
- Do not rely on interactive shell startup files being sourced.
- If you execute a script directly, ensure it has the correct shebang and execute permission.
- Do not assume `python` on `PATH` is the interpreter you want.

---

## macOS Guidance

macOS setup is usually similar to Linux, but path and interpreter consistency deserve extra attention.

### Recommended Patterns

- Use absolute paths for executables and wrappers.
- Use `bash` or another explicit shell to run wrappers when needed.
- Use `{python}` only when the evaluator intentionally shares GOW's interpreter.
- Prefer explicit interpreter paths over `python` from `PATH`.

Good examples:

```yaml
evaluator:
  command: ["/Users/me/tools/evaluator/bin/evaluator"]
```

```yaml
evaluator:
  command: ["bash", "/Users/me/tools/evaluator/run-evaluator.sh"]
```

```yaml
evaluator:
  command: ["/Users/me/venvs/evaluator/bin/python", "/Users/me/workflows/evaluator.py"]
```

### Common macOS Notes

- Avoid depending on whichever `python` happens to be first on `PATH`.
- Keep Homebrew or system-installed tools separate from GOW's Python environment unless they truly belong together.
- If a vendor tool depends on shell initialization, capture that logic in a wrapper instead of relying on an interactive terminal state.

---

## Best Practices

- Install GOW in a dedicated Python environment.
- Treat `evaluator.command` as the source of truth for the evaluator runtime.
- Use `{python}` only when the evaluator should share GOW's interpreter.
- Use direct executable paths for compiled or self-contained evaluators.
- Use wrapper scripts when activation or runtime preparation is required.
- Prefer absolute paths over relative paths in production workflows.
- Prefer explicit interpreters over `python` on `PATH` when not using `{python}`.
- Keep `evaluator.env` for small runtime settings, not environment switching.
- Record evaluator-specific setup in version-controlled wrappers instead of relying on ad hoc terminal state.

---

## Common Pitfalls

- Installing evaluator-specific dependencies into GOW's environment without a reason.
- Using `{python}` for an evaluator that actually belongs in a different environment.
- Assuming that activating an environment manually before `gow run` is enough documentation.
- Treating `evaluator.env` as if it can replace environment activation.
- Using shell-specific syntax directly in `evaluator.command` without explicitly invoking the shell.
- Relying on relative paths that break when the workflow is moved to another machine or directory.
- Using `python` from `PATH` when a specific interpreter is required.
- Mixing optional plotting or analysis dependencies with the evaluator runtime and assuming they must always live together.

---

## A Practical Rule of Thumb

If you are unsure, start with this approach:

1. Install GOW in its own Python environment.
2. If the evaluator is a small Python script, use `{python}`.
3. If the evaluator is a compiled tool, call it directly.
4. If the evaluator needs setup, write a wrapper script.
5. Only merge environments when that clearly makes the workflow simpler and does not create dependency risk.

That default scales well from toy evaluators to production simulation workflows.

---

## Summary

GOW does not require evaluators to live in the same environment. It only requires a command that can launch them reliably.

The canonical choices are:

- **`{python}`** for Python evaluators that should share GOW's environment
- **direct executable paths** for compiled or self-contained evaluators
- **wrapper scripts** when environment setup is part of the runtime

Use the simplest option that keeps the runtime explicit, reproducible, and isolated where needed.

For a concrete example of a compiled evaluator configured through `evaluator.command`, see:

- **[A 2D Benchmark Function Evaluator for the Generic Optimization Workflow](/2d-function-evaluator)**
