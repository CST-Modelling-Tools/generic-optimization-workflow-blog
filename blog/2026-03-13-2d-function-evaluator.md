---
slug: 2d-function-evaluator
title: A 2D Benchmark Function Evaluator for the Generic Optimization Workflow
authors: [mblanco]
tags: [gow, optimization, benchmark, algorithms, visualization]
description: A worked example showing how to build, verify, and run the 2D Function Evaluator with the Generic Optimization Workflow.
keywords: [GOW, optimization algorithms, benchmark functions, rastrigin, rosenbrock, evaluator example]
image: /img/gow-social-card.jpg
---

!["Animated overview of the benchmark functions included in the 2D Function Evaluator"](/img/benchmark-functions.gif)

# A 2D Benchmark Function Evaluator for the Generic Optimization Workflow

The **2D Function Evaluator** is a lightweight benchmark evaluator for testing optimization algorithms with GOW before moving on to more expensive simulation-driven problems.

It is useful because it provides:

- fast objective evaluations
- reproducible benchmark problems
- direct visualization of the objective landscape
- a clean external evaluator that can be launched by GOW

This post is a worked example. It shows how to build the evaluator, verify it, and connect it to a GOW problem.

For the canonical explanation of the evaluator contract, see:

- **[GOW: Architecture, Evaluator Contract, and Provenance](/gow-architecture-and-usage)**

For environment and cross-platform execution guidance, see:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

<!--truncate-->

---

## What the Project Contains

The repository includes two complementary pieces:

- a **C++ evaluator executable**
- optional **Python scripts** for visualization and post-run analysis

Repository:

**https://github.com/CST-Modelling-Tools/2D-function-evaluator**

The executable is the runtime target for GOW. The Python utilities are for plotting, extracting histories, and generating benchmark visualizations.

This example is intentionally simple. The evaluator is a single executable and does not require a separate evaluator workflow specification. More complex scientific evaluators may need their own YAML or other auxiliary files in addition to GOW's problem specification.

---

## Build the Evaluator

Clone the repository:

```bash
git clone https://github.com/CST-Modelling-Tools/2D-function-evaluator.git
cd 2D-function-evaluator
```

Build with CMake:

```bash
cmake -S . -B build
cmake --build build
```

After the build completes, CMake copies the executable to the repository-level `bin/` directory:

- Linux or macOS: `bin/2d-function-evaluator`
- Windows: `bin/2d-function-evaluator.exe`

That `bin/` path is the value you will reference from `evaluator.command`.

### Optional Python Tools

The repository also includes optional Python utilities:

```bash
pip install -r scripts/requirements.txt
```

Those plotting and analysis tools do **not** define where the evaluator runtime should live. For that decision, use:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

---

## Verify the Build

Before integrating the evaluator with GOW, verify that the executable works.

On Linux or macOS:

```bash
./bin/2d-function-evaluator --print-functions
```

On Windows PowerShell:

```powershell
.\bin\2d-function-evaluator.exe --print-functions
```

If the command succeeds, the executable is ready to use.

You can also verify the optional plotting tooling with:

```bash
python scripts/plot_benchmark_functions.py \
  --out-dir artifacts/test \
  --gallery \
  --animated-gif
```

---

## Minimal GOW Configuration

To use the evaluator with GOW, define a problem specification that includes:

- two optimizable parameters, `x` and `y`
- one fixed parameter, `function`
- an evaluator command that points to the built executable

That is enough for this benchmark evaluator. More complex evaluators may need additional evaluator-owned files and their own internal workflow configuration. Those belong to the evaluator layer described in:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

Example:

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
```

On Linux or macOS, point `command` to `bin/2d-function-evaluator` instead.

The evaluator expects three parameters:

- `x`
- `y`
- `function`

---

## Run It with GOW

Once the specification is in place, start an optimization run with:

```bash
gow run path/to/optimization_specs.yaml
```

For the full structure of `optimization_specs.yaml` and the CLI prerequisites for invoking `gow`, see:

- **[Defining and Running an Optimization Problem in GOW](/defining-and-running-an-optimization-problem)**

For one-off debugging of a specific candidate, use:

```bash
gow evaluate path/to/optimization_specs.yaml \
  --run-id demo-run \
  --generation-id 0 \
  --candidate-index 0 \
  --param x=0.25 \
  --param y=-0.5
```

That runs one candidate through the standard GOW workflow.

If you need guidance on evaluator runtime selection, use the canonical setup guide:

- **[Running GOW with External Evaluators on Windows, Linux, and macOS](/running-gow-with-external-evaluators)**

---

## Using the Evaluator Stand-Alone

The evaluator can also be run without GOW. This is useful for smoke tests and reference outputs.

Example `input.json`:

```json
{
  "run_id": "demo-run",
  "candidate_id": "manual",
  "params": {
    "x": 0.1,
    "y": -0.3,
    "function": "rastrigin"
  },
  "context": {}
}
```

On Linux or macOS:

```bash
./bin/2d-function-evaluator --input input.json --output output.json
```

On Windows PowerShell:

```powershell
.\bin\2d-function-evaluator.exe --input input.json --output output.json
```

Example `output.json`:

```json
{
  "status": "ok",
  "metrics": {
    "f": 15.099660112501051
  },
  "objective": 15.099660112501051
}
```

The file contract is documented in:

- **[GOW: Architecture, Evaluator Contract, and Provenance](/gow-architecture-and-usage)**

---

## Benchmark Functions

The evaluator currently includes the following two-dimensional benchmark functions:

| Function | Internal name | Characteristic |
|---|---|---|
| Sphere | `sphere` | Simple convex landscape |
| Rosenbrock | `rosenbrock` | Narrow curved valley |
| Rastrigin | `rastrigin` | Highly multimodal |
| Ackley | `ackley` | Many local minima |
| Himmelblau | `himmelblau` | Multiple global minima |
| Beale | `beale` | Complex polynomial landscape |
| Goldstein-Price | `goldstein_price` | Strongly nonlinear surface |
| McCormick | `mccormick` | Smooth surface with saddle regions |

These functions expose different optimization behaviors while remaining cheap to evaluate.

---

## Typical Workflow

A practical workflow with this evaluator looks like:

1. Build the evaluator.
2. Verify the executable with `--print-functions`.
3. Point `evaluator.command` at the built binary.
4. Run a local optimization with `gow run`.
5. Inspect the resulting artifacts.
6. Use the optional Python tools to extract histories and generate plots.

For example, after a run completes:

```bash
python scripts/extract_history.py --run-dir <gow-run-dir> --out history.csv --pop-size 100
```

Then:

```bash
python scripts/plot_trajectory.py --history history.csv --out trajectory.png
```

Because evaluations are fast, this setup is useful for:

- testing new optimizers
- comparing search strategies
- debugging workflow behavior
- validating result analysis tooling

---

## Summary

The 2D Function Evaluator is a practical benchmark tool for GOW. It provides a fast external evaluator, a small but useful problem family, and optional visualization tools.

Use it as a clean worked example of a GOW-compatible evaluator, then carry the same execution pattern into more complex real-world evaluators.
