---
slug: defining-and-running-an-optimization-problem
title: "Defining and Running an Optimization Problem in GOW"
authors: [mblanco]
tags: [gow, optimization, workflows]
description: Canonical guidance for defining a GOW optimization problem in YAML, deciding what belongs in the specification, and running the problem from the CLI.
keywords: [GOW, optimization_specs.yaml, optimization problem, evaluator command, gow run, gow evaluate]
image: /img/gow-social-card.jpg
---

# Defining and Running an Optimization Problem in GOW

*Canonical guidance for problem definition and CLI usage*

This post explains how to define an optimization problem in GOW and how to run it from the command line.

It is the canonical reference for:

- where a GOW problem lives
- what `optimization_specs.yaml` represents
- the structure of the optimization specification
- what belongs in `parameters`, `evaluator`, `optimizer`, and `context`
- what does **not** need to be modeled directly in the GOW YAML
- the main CLI commands used to run and debug a problem

For the conceptual execution model, see:

- **[GOW: Architecture, Evaluator Contract, and Provenance](/gow-architecture-and-usage)**

For evaluator runtime strategy and `evaluator.command`, see:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

<!-- truncate -->

---

## Where a Problem Lives

A GOW optimization problem lives in a **user workspace**.

That workspace is separate from:

- the GOW installation directory
- the evaluator installation directory
- the Python environment used to install GOW

The workspace is user-owned. It contains the files that define and support a specific optimization study.

The central file is the optimization specification YAML, often named:

```text
optimization_specs.yaml
```

The filename itself is not special. What matters is that the file defines the problem and that GOW is invoked with its path.

---

## What the Optimization Specification Defines

The optimization specification tells GOW what it needs to know in order to run the optimization process.

At a high level, it defines:

- the problem identifier
- the optimization objective
- the parameters visible to the optimization process
- how GOW should launch the evaluator
- which optimizer configuration to use
- optional metadata about the study

It does **not** need to contain every file or every internal detail used by the evaluator.

Complex evaluators may also have their own configuration, templates, datasets, or workflow specifications. Those belong to the evaluator layer, not necessarily to the GOW YAML.

---

## Top-Level Structure

A typical optimization specification contains these top-level sections:

- `id`
- `objective`
- `parameters`
- `evaluator`
- `optimizer`
- `context`

In practice:

- `id`, `objective`, `parameters`, `evaluator`, and `optimizer` are the practical minimum for normal optimization runs
- `context` is optional

Minimal example:

```yaml
id: toy-sphere-de

objective:
  direction: minimize

parameters:
  x:
    type: real
    value: 0.0
    bounds: [-5.0, 5.0]

  y:
    type: real
    value: 0.0
    bounds: [-5.0, 5.0]

  mode:
    type: categorical
    value: baseline
    optimizable: false

evaluator:
  command: ["{python}", "evaluator.py"]
  timeout_s: 60

optimizer:
  name: differential_evolution
  seed: 123
  max_evaluations: 100
  batch_size: 10

context:
  study: "toy validation problem"
```

---

## Section-by-Section Reference

### `id`

`id` identifies the optimization problem.

Example:

```yaml
id: toy-sphere-de
```

It should be stable, human-readable, and meaningful within the user workspace.

### `objective`

`objective` tells GOW how to interpret the scalar objective returned by the evaluator.

Example:

```yaml
objective:
  direction: minimize
```

Typical values:

- `minimize`
- `maximize`

This section does **not** define how the evaluator computes the objective. It only tells GOW how to interpret it.

### `parameters`

`parameters` defines the values that belong to the optimization problem as GOW sees it.

These may include:

- optimizable parameters
- fixed parameters that should remain part of the tracked problem state

Examples:

```yaml
parameters:
  x:
    type: real
    value: 0.0
    bounds: [-5.0, 5.0]

  n:
    type: int
    value: 5
    bounds: [1, 20]

  material:
    type: categorical
    value: copper
    choices: [copper, aluminum]

  mode:
    type: categorical
    value: baseline
    optimizable: false
```

Common fields:

- `type`
- `value`
- `optimizable`

Additional fields depend on the type:

- `bounds` for `real` and `int`
- `choices` for `categorical`

### `evaluator`

`evaluator` tells GOW how to launch the evaluator.

Example:

```yaml
evaluator:
  command: ["{python}", "evaluator.py"]
  timeout_s: 60
  env:
    OMP_NUM_THREADS: "1"
```

Typical fields include:

- `command`
- `timeout_s`
- `env`
- `extra_args`

`command` is the most important field. It determines which process GOW launches for each evaluation.

For detailed runtime guidance, see:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

### `optimizer`

`optimizer` defines how candidate solutions are proposed.

Example:

```yaml
optimizer:
  name: differential_evolution
  seed: 123
  max_evaluations: 100
  batch_size: 10
```

The exact contents depend on the optimizer being used.

### `context`

`context` is optional. It can hold descriptive metadata that should travel with the problem definition.

Example:

```yaml
context:
  study: "baseline validation"
  owner: "team-a"
```

This section is useful for metadata, but it is not a substitute for evaluator-owned workflow files.

---

## What Belongs in `parameters`

Put information in `parameters` when it is part of the optimization state that GOW should track.

This usually means:

- values that may change from candidate to candidate
- fixed values that still define the problem being optimized
- values that should appear in candidate-level provenance

Examples:

- geometric dimensions
- algorithmic settings exposed to optimization
- material choice
- model mode, if it should remain visible in the tracked problem state

---

## What Does Not Need to Be in the GOW YAML

Not every evaluator input belongs in `optimization_specs.yaml`.

Evaluator-owned inputs often include:

- large datasets
- templates
- meshes
- lookup tables
- solver-chain descriptions
- evaluator workflow YAML files
- internal post-processing rules

These files may be essential for the evaluator, but GOW does not need to interpret them directly.

The practical rule is:

- if GOW should track it as part of the problem or candidate state, keep it GOW-visible
- if it is evaluator-internal or too domain-specific for GOW to model, keep it in evaluator-owned files

For the evaluator-side distinction, see:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

---

## Where Evaluator Data Should Be Stored

Static evaluator inputs should normally live in the user workspace or in evaluator-owned locations referenced from that workspace.

Typical examples:

- problem-specific datasets
- templates
- geometry files
- reference files
- evaluator workflow configuration

They should not normally be stored:

- inside the GOW installation directory
- inside the GOW Python environment
- inside candidate output directories, unless they are generated during the run

Per-candidate generated files belong in GOW's run/output directories.

---

## Minimal Complete Example

The following example is small but complete:

```yaml
id: rastrigin-demo

objective:
  direction: minimize

parameters:
  x:
    type: real
    value: 0.0
    bounds: [-5.12, 5.12]

  y:
    type: real
    value: 0.0
    bounds: [-5.12, 5.12]

  function:
    type: categorical
    value: rastrigin
    optimizable: false

evaluator:
  command: ["D:/OpenSource/2D-function-evaluator/bin/2d-function-evaluator.exe"]
  timeout_s: 60

optimizer:
  name: differential_evolution
  seed: 123
  max_evaluations: 200
  batch_size: 20

context:
  study: "2D benchmark validation"
```

This example is simple because the evaluator is a single executable. More complex evaluators may use the same GOW structure while also reading evaluator-owned files.

For a concrete worked example, see:

- **[A 2D Benchmark Function Evaluator for the Generic Optimization Workflow](/2d-function-evaluator)**

---

## Core CLI Commands

The two most important CLI commands are:

- `gow run`
- `gow evaluate`

Before using these commands, ensure that the Python environment containing GOW is active, or otherwise ensure that the installed `gow` command is available on `PATH`.

Typical activation commands are:

These examples assume that the current directory contains the `.venv` folder. If the GOW environment is stored elsewhere, use the correct relative path or an absolute path to that environment.

- Linux or macOS:

```bash
source .venv/bin/activate
```

Here `source` means “run this script in the current shell session” so that the environment changes remain active in that shell.

- Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Then verify that the CLI is available:

```bash
gow --help
```

If that environment is not active, commands such as:

```bash
gow run ...
```

may fail with an error indicating that `gow` is unknown or not recognized.

In other words, examples in this post assume that GOW has already been installed and that its CLI entry point is available in the current shell session.

For installation and environment setup details, see:

- **[Installing GOW and Choosing a Backend](/gow-installation-and-backends)**

### `gow run`

Use `gow run` to start an optimization run from a specification file.

Example:

```bash
gow run path/to/optimization_specs.yaml
```

This command:

- loads and validates the specification
- initializes the optimizer
- launches evaluator runs as candidates are proposed
- records results and provenance in the output directory

### Where Results Go

By default, GOW writes run outputs in a results location associated with the problem workspace. In normal usage, this means the results live alongside the optimization specification or in a workspace-owned output location derived from it.

If the CLI supports an explicit `--outdir` option for your workflow, that option overrides the default location.

What matters operationally is:

- the optimization specification lives in the user workspace
- static evaluator inputs live in the workspace or referenced evaluator-owned locations
- generated run artifacts are written to the output/results directory for that run

### `gow evaluate`

Use `gow evaluate` to run one manual candidate evaluation from the same specification.

Example:

```bash
gow evaluate path/to/optimization_specs.yaml \
  --run-id demo-run \
  --generation-id 0 \
  --candidate-index 0 \
  --param x=0.25 \
  --param y=-0.5
```

This command is useful for:

- debugging the evaluator
- testing one candidate by hand
- verifying that the specification behaves as expected

---

## Typical Execution Flow

In practice, the workflow is usually:

1. Create or select a user workspace.
2. Write the optimization specification YAML.
3. Ensure the evaluator command is correct.
4. Store evaluator-owned static inputs in the workspace or referenced locations.
5. Run `gow run <spec.yaml>`.
6. Use `gow evaluate <spec.yaml> ...` when manual debugging is needed.
7. Inspect the generated run artifacts in the run output directory.

---

## Common Mistakes

- defining the problem inside the GOW installation directory instead of a user workspace
- assuming `optimization_specs.yaml` must contain every evaluator input
- confusing fixed GOW parameters with evaluator-private auxiliary files
- putting evaluator runtime logic into the wrong layer
- using the wrong `evaluator.command`
- storing static evaluator inputs inside generated candidate output directories

---

## Related Reading

- **[GOW: Architecture, Evaluator Contract, and Provenance](/gow-architecture-and-usage)**
- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**
- **[A 2D Benchmark Function Evaluator for the Generic Optimization Workflow](/2d-function-evaluator)**
- **[Installing GOW and Choosing a Backend](/gow-installation-and-backends)**
