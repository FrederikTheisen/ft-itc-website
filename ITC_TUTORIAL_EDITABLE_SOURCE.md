---
page: /how-to-analyze-itc-data
title: "How to Analyze ITC Data: From Thermogram to Binding Parameters"
description: "A practical FT-ITC Analysis guide from raw thermogram to fitted result."
author: "Frederik Theisen · FT-ITC Analysis"
last_updated: "2026-08-27"
last_synced: "2026-08-27"
status: "Editable content source — not rendered automatically"
---

# How to Analyze ITC Data: From Thermogram to Binding Parameters

Use this guide for a first pass through your own raw ITC experiment. Open the file, inspect the differential-power trace, assign a baseline, integrate the injection peaks, fit a binding model, then save and export the result.

> **How to edit this file**
>
> Edit the headings, prose, lists, links, image captions, and image choices in plain Markdown. The website keeps its visual layout when this is translated back to HTML. Add a short note below an image if you want its placement or size to change. When you are ready, say “sync the tutorial Markdown” and I will apply your edited content to the website page.

## The short version

1. **Open and check the experiment.** Confirm the cell and syringe solutions, concentrations, temperature, injection settings, and any imported comments that mean a saved value should be corrected.
2. **Inspect the trace first.** Check the injection peaks and baseline behaviour across the run, including whether the power signal returns to the baseline before the next injection.
3. **Assign the baseline.** Choose a simple baseline representation, use baseline regions between injections to guide it, and compare the differential-power trace with the series of integrated heats.
4. **Integrate the injection peaks.** Inspect early, middle, and late injections, then apply a consistent integration rule across the run.
5. **Fit, review, save, and export.** Run a binding model that matches the experiment, inspect the fitted binding isotherm and residuals, save the project, and export the final figure.

---

## 1. Import and experiment context

### Open the experiment and check what the file contains

Start by checking what you imported and the experiment details that go with it. The workflow moves from a raw differential-power trace, to integrated heats, to a fitted binding isotherm.

#### Raw thermogram

The thermogram is the differential-power trace recorded as a function of time. Each injection produces a peak whose sign and magnitude reflect the net heat of injection and the instrument sign convention.

#### Integrated heats

Integrating the baseline-corrected differential-power response gives one heat for each injection. The integrated heats can contain the heat of binding as well as mixing, dilution, buffer mismatch, thermal equilibration, and other contributions.

#### Fitted isotherm and parameters

The integrated heats are plotted against a concentration or molar-ratio coordinate to form a binding isotherm. A selected binding model then estimates quantities such as _K_<sub>d</sub> or _K_<sub>a</sub>, stoichiometry, and enthalpy.

Check the cell and syringe identities, concentrations, temperature, buffer, injection volume, spacing, and imported comments. These values set the molar-ratio axis and are part of the fit.

> **Choose the right starting point**
>
> - **Raw thermogram inputs:** MicroCal-style **.itc**, TA NanoITC **.nitc**, NanoAnalyze **.ta**, and PEAQ-ITC **.apj** open into the thermogram-processing workflow.
> - **Integrated-heats inputs:** compatible **.dat**, **.aff**, and **.dh** files begin with experiment details and fitting.
> - **Project inputs:** **.ftxtc** and legacy **.ftitc** reopen an FT-ITC project.
>
> [Read the full file-format reference](https://ft-itc.org/manual/installation-files-projects#supported-input-formats)

![FT-ITC Analysis welcome screen with an Open File button](media/tutorials/processing-and-analysis/avalonia-startscreen.webp)

*Start with **Open File…**, then check the experiment context before changing the data.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a compact maximum width of about 560px. -->

---

> **Before baseline correction**
>
> Scan the full differential-power trace, then inspect an early injection. Check the peak sign, baseline behaviour, and whether the power signal returns to the baseline before the next injection begins.

## 2. Baseline correction

### Assign a baseline, then inspect the integrated heats

Start with the simplest baseline representation that follows the baseline regions between injections and observed drift. Use **Polynomial** for smooth global drift, **Spline** to place editable points in baseline regions, or **Segmented** when the drift changes locally across the run.

![FT-ITC Analysis Process Data workspace with a black thermogram trace, red baseline and processing controls](media/tutorials/processing-and-analysis/avalonia-processing.webp)

*The Process Data workspace keeps the whole trace, baseline, and processing controls together.*

<!-- Website layout note: use the existing compact side-by-side page layout. Show the full screenshot at its natural aspect ratio. -->

> **Keep processing and fitting separate**
>
> Set the baseline and integration boundaries from the differential-power trace. Then inspect the integrated heats before fitting; do not change the processing simply to make a binding model fit better.

With a Spline, move the automatic points or place your own in baseline regions between injections. Right-click a point to remove it or mark it linear; mark neighbouring points linear when you want a straight section between them. After a larger change, review the integrated heats before moving on.

![Close view of an ITC thermogram with a red baseline and editable control points](media/tutorials/processing-and-analysis/processing-baseline-linear.webp)

*Use the red line and control points to align the baseline with the regions between injections.*

<!-- Website layout note: show the full portrait screenshot at its natural aspect ratio with a compact maximum width of about 520px. -->

[Read the processing controls in the manual](https://ft-itc.org/manual/processing-thermograms)

---

## 3. Peak integration

### Integrate injection peaks and inspect the integrated heats

Select an early, middle, and late injection. Use **Start** and **Length** to set integration boundaries that include the full response and end after the power signal has returned to the baseline, before the next injection.

**Fit Peaks** provides initial estimates for the integration end boundaries, and you can adjust any result afterwards. Use **Copy to next peak** when neighbouring injections need the same treatment; press **Space** to move through the selected peaks. When the integration regions are set, review the complete series of integrated heats against the thermogram.

![Selected ITC injection with a blue integration window and calculated injection heat](media/tutorials/processing-and-analysis/avalonia-processing-zoom.webp)

*Use the selected-injection view to set an integration region, then apply the same rule across the series.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a maximum width of about 720px. -->

> **If you have a buffer titration**
>
> Most analyses do not need a buffer titration. The main reason to use one is dilution heat that is non-constant across the run; it can also provide a no-interaction control for weak, low-enthalpy binding. In Buffer Subtraction, start with **Linear**: point-by-point **Matched** subtraction carries the reference noise into the corrected heats. If binding is not saturated at the end of the experiment, the reference can also help constrain the injection-heat offset; assess that correction carefully.
>
> [Read the buffer-subtraction workflow](https://ft-itc.org/manual/additional-tools#buffer-subtraction)

[Read about integration regions and processing-derived error](https://ft-itc.org/manual/processing-thermograms#integration-regions)

---

## 4. Fit the binding isotherm

### Fit the binding isotherm with a first model

Open **Analyze Data** in **Single experiment** mode once the integrated heats and experiment details are ready. Select a binding model from what is known about the molecular system and an initial evaluation of the binding isotherm. **One-Set-Of-Sites** is a useful first model when the system has one class of equivalent, independent sites.

Check the units, concentrations, and starting parameter values, then select **Run Fit**. The graph updates with the fitted binding isotherm, residuals, and parameter estimates.

![FT-ITC Analysis Analyze Data workspace showing a One-Set-Of-Sites fit, residuals and Bootstrap residuals settings](media/tutorials/processing-and-analysis/analysis-basic.webp)

*The fitting view puts the model, isotherm, residuals, and fit controls in one place.*

<!-- Website layout note: use the existing compact side-by-side page layout. Show the full screenshot at its natural aspect ratio. -->

> **Caution — a fitted curve does not establish a model**
>
> Choose a model using knowledge of the system and what the binding isotherm can support, then compare the fitted curve with the integrated heats and inspect the residual pattern. Systematic deviations that recur across replicate experiments are a good indication that a different model may be required. For a discrepancy in one experiment, return to the trace, baseline, or integration regions before changing the model.

For related experiments that belong to one series, continue with [multiple-experiment fitting](https://ft-itc.org/manual/multiple-experiments) or [Advanced analysis](https://ft-itc.org/analysis).

[Read the documented model assumptions](https://ft-itc.org/manual/fitting-models#models)

---

## 5. Review, save, and export

### Check the fitted isotherm, save the project, and make the final figure

Look at the fitted binding isotherm and residuals together. If a particular injection or region departs from the fit, return to the corresponding trace, baseline, or integration region and make one focused change before running the fit again.

![FT-ITC Analysis fitted-result view showing parameter values, residuals and result status](media/tutorials/processing-and-analysis/analysis-result.webp)

*The result view keeps the fitted parameter estimates, binding isotherm, and residuals together for review.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a maximum width of about 720px. -->

Save the project as **.ftxtc** once you have useful processing, then save it again after fitting. Use **Final Figure** to assemble the thermogram, fitted isotherm, and residuals, then select **Export PDF**.

![FT-ITC Analysis Final Figure workspace showing a thermogram, fitted binding isotherm, residuals and PDF export controls](media/tutorials/processing-and-analysis/finalfigure.webp)

*Before exporting, check that the thermogram, fitted binding isotherm, residuals, labels, and parameter box describe the same analysis.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a maximum width of about 800px. -->

[Read the figures and export guide](https://ft-itc.org/manual/figures-printing-export)

---

## Frequently asked questions

### Which workspace should I start in for my file?

Raw **.itc**, **.nitc**, **.ta**, and **.apj** inputs begin in **Process Data**. Compatible **.dat**, **.aff**, and **.dh** files already contain integrated heats, so they begin with experiment details and fitting. **.ftxtc** and legacy **.ftitc** files reopen an FT-ITC project. [See supported formats](https://ft-itc.org/manual/installation-files-projects#supported-input-formats).

### What baseline should I start with?

Start with the simplest baseline representation that follows the baseline regions between injections: **Polynomial** for smooth global drift, **Spline** for editable points in baseline regions, or **Segmented** when drift changes locally. Compare the differential-power trace and integrated heats after each change. [See baseline models](https://ft-itc.org/manual/processing-thermograms#baseline-models-and-editing).

### How should I set peak boundaries?

Use **Start** and **Length** to set integration boundaries that include the full injection response and end after the power signal returns to the baseline, before the next injection. Check more than one injection, then use **Fit Peaks** or **Copy to next peak** to speed up repeated work. [See integration regions](https://ft-itc.org/manual/processing-thermograms#integration-regions).

### Do I need a buffer or dilution reference?

No. Most analyses do not need a buffer titration. Consider one primarily when dilution heat is non-constant; it can also provide a no-interaction control for weak, low-enthalpy binding. Use **Linear** as the default subtraction; if binding is not saturated at the end of the experiment, a buffer titration can also help constrain the injection-heat offset, but assess that correction carefully. [See Buffer Subtraction](https://ft-itc.org/manual/additional-tools#buffer-subtraction).

### Which binding model should I try first?

Start with a binding model based on knowledge of the molecular system and evaluation of the binding isotherm. **One-Set-Of-Sites** is a useful first choice for one class of equivalent, independent sites; the manual describes the other available models and their inputs. [See the model reference](https://ft-itc.org/manual/fitting-models#models).

### What should I do if the curve or residuals look wrong?

Identify the injections or regions responsible for the discrepancy, then inspect the corresponding integrated heat, integration region, baseline, and differential-power trace. Make one focused change and rerun the fit. If the application itself behaves unexpectedly, [contact Support](https://ft-itc.org/support).

---

## Further reading

- [Supported inputs and FT-ITC projects](https://ft-itc.org/manual/installation-files-projects#supported-input-formats)
- [Baseline, integration, and injection uncertainty](https://ft-itc.org/manual/processing-thermograms)
- [Single-experiment fitting and diagnostics](https://ft-itc.org/manual/fitting-models)
- [Multiple-experiment fitting and constraints](https://ft-itc.org/manual/multiple-experiments)
- [Advanced analysis and global fitting context](https://ft-itc.org/analysis)
