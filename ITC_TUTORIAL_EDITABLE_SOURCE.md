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

Use this guide for a first pass through your own raw ITC experiment. Open the file, check the trace, set a baseline, integrate the peaks, fit a model, then save and export the result.

> **How to edit this file**
>
> Edit the headings, prose, lists, links, image captions, and image choices in plain Markdown. The website keeps its visual layout when this is translated back to HTML. Add a short note below an image if you want its placement or size to change. When you are ready, say “sync the tutorial Markdown” and I will apply your edited content to the website page.

## The short version

1. **Open and check the experiment.** Confirm the sample, titrant, concentrations, temperature, injection settings, and any imported comments that mean a saved value should be corrected.
2. **Look at the trace first.** Check the peak and baseline behaviour across the run, including whether the signal returns before the next injection.
3. **Set the baseline.** Choose a simple starting baseline, place it in quiet trace regions, and compare the trace with the heat series.
4. **Integrate the peaks.** Check a few injections closely, then use the same approach across the run.
5. **Fit, review, save, and export.** Run a model that matches the experiment, inspect the curve and residuals, save the project, and export the final figure.

---

## 1. Import and experiment context

### Open the experiment and check what the file contains

Start by checking what you imported and the experiment details that go with it. The workflow moves from a raw power trace, to integrated heats, to a fitted isotherm.

#### Raw thermogram

The thermogram records differential power over time. Each injection produces a peak whose direction and size depend on the heat associated with the experiment and the instrument convention.

#### Integrated heats

Peak integration assigns an area to each injection after baseline handling. Those values can contain binding heat as well as mixing, dilution, buffer mismatch, temperature-equilibration and other contributions.

#### Fitted isotherm and parameters

The integrated heats are plotted against a concentration or molar-ratio coordinate to form a binding isotherm. A selected model then estimates quantities such as _K_<sub>d</sub> or _K_<sub>a</sub>, stoichiometry, and enthalpy.

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
> Scan the full trace, then zoom into an early injection. Look at peak direction, baseline behaviour, and whether the signal has returned before the next injection begins.

## 2. Baseline correction

### Set a baseline, then look at the heats

Start with the simplest baseline that follows the quiet regions of the trace. Use **Polynomial** for smooth drift, **Spline** when you want to place points directly, or **Segmented** when different parts of the run need local treatment.

![FT-ITC Analysis Process Data workspace with a black thermogram trace, red baseline and processing controls](media/tutorials/processing-and-analysis/avalonia-processing.webp)

*The Process Data workspace keeps the whole trace, baseline, and processing controls together.*

<!-- Website layout note: use the existing compact side-by-side page layout. Show the full screenshot at its natural aspect ratio. -->

> **Caution — the baseline changes every integrated heat**
>
> Let the quiet parts of the trace set the baseline. After a change, compare both the trace and the heat series rather than adjusting the baseline to make a preferred fitted curve.

With a Spline, move the automatic points or place your own where the trace has settled. Right-click a point to remove it or mark it linear; mark neighbouring points linear when you want a straight section between them. After a larger change, review the heat series before moving on.

![Close view of an ITC thermogram with a red baseline and editable control points](media/tutorials/processing-and-analysis/processing-baseline-linear.webp)

*Use the red line and control points to match the baseline to the quiet parts of the trace.*

<!-- Website layout note: show the full portrait screenshot at its natural aspect ratio with a compact maximum width of about 520px. -->

[Read the processing controls in the manual](https://ft-itc.org/manual/processing-thermograms)

---

## 3. Peak integration

### Integrate the peaks and review the series

Select an early, middle, and late injection. Use **Start** and **Length** to cover the response until it has returned to the baseline before the next event.

**Fit Peaks** is a useful first estimate for end points, and you can adjust any result afterwards. Use **Copy to next peak** when neighbouring injections need the same treatment; press **Space** to move through the selected peaks. When the peak regions are set, review the complete heat series against the thermogram.

![Selected ITC injection with a blue integration window and calculated injection heat](media/tutorials/processing-and-analysis/avalonia-processing-zoom.webp)

*Use the selected-injection view to set one peak region, then apply the same rule across the series.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a maximum width of about 720px. -->

> **If you have a matched buffer or dilution reference**
>
> Use Buffer Subtraction to compare the background heat with the main experiment. Start with **Matched** when the reference uses the same injection schedule; **Linear** and **Exp. decay** are alternatives when the reference changes across the run.
>
> [Read the buffer-subtraction workflow](https://ft-itc.org/manual/additional-tools#buffer-subtraction)

[Read about integration regions and processing-derived error](https://ft-itc.org/manual/processing-thermograms#integration-regions)

---

## 4. Fit the experiment

### Choose a first model and run the fit

Open **Analyze Data** in **Single experiment** mode once the integrated heats and experiment details are ready. **One-Set-Of-Sites** is a useful first model when the experiment represents one class of equivalent, independent sites. Use another model when it better matches the experiment you performed.

Check the units, concentrations, and starting values, then select **Run Fit**. The graph updates with the fitted curve, residuals, and parameter values.

![FT-ITC Analysis Analyze Data workspace showing a One-Set-Of-Sites fit, residuals and Bootstrap residuals settings](media/tutorials/processing-and-analysis/analysis-basic.webp)

*The fitting view puts the model, isotherm, residuals, and fit controls in one place.*

<!-- Website layout note: use the existing compact side-by-side page layout. Show the full screenshot at its natural aspect ratio. -->

> **Caution — a fitted curve is not the whole decision**
>
> Choose a model because it represents the experiment, then inspect the curve and residuals. If a part of the fit stands out, return to the trace, baseline, or peak regions before trying a different model.

For related experiments that belong to one series, continue with [multiple-experiment fitting](https://ft-itc.org/manual/multiple-experiments) or [Advanced analysis](https://ft-itc.org/analysis).

[Read the documented model assumptions](https://ft-itc.org/manual/fitting-models#models)

---

## 5. Review, save, and export

### Check the fit, save the project, and make the final figure

Look at the fitted curve and residuals together. If one part of the plot stands out, return to the corresponding trace, baseline, or peak region and make one focused change before running the fit again.

![FT-ITC Analysis fitted-result view showing parameter values, residuals and result status](media/tutorials/processing-and-analysis/analysis-result.webp)

*The result view keeps the fitted values, curve, and residuals together for review.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a maximum width of about 720px. -->

Save the project as **.ftxtc** once you have useful processing, then save it again after fitting. Use **Final Figure** to assemble the thermogram, fitted isotherm, and residuals, then select **Export PDF**.

![FT-ITC Analysis Final Figure workspace showing a thermogram, fitted binding isotherm, residuals and PDF export controls](media/tutorials/processing-and-analysis/finalfigure.webp)

*Before exporting, check that the thermogram, fitted isotherm, residuals, labels, and parameter box describe the same result.*

<!-- Website layout note: show the full screenshot at its natural aspect ratio with a maximum width of about 800px. -->

[Read the figures and export guide](https://ft-itc.org/manual/figures-printing-export)

---

## Frequently asked questions

### Which workspace should I start in for my file?

Raw **.itc**, **.nitc**, **.ta**, and **.apj** inputs begin in **Process Data**. Compatible **.dat**, **.aff**, and **.dh** files already contain integrated heats, so they begin with experiment details and fitting. **.ftxtc** and legacy **.ftitc** files reopen an FT-ITC project. [See supported formats](https://ft-itc.org/manual/installation-files-projects#supported-input-formats).

### What baseline should I start with?

Start with the simplest option that follows the quiet parts of the trace: **Polynomial** for smooth drift, **Spline** for direct point editing, or **Segmented** for locally changing drift. Look at the trace and heat series after each change. [See baseline models](https://ft-itc.org/manual/processing-thermograms#baseline-models-and-editing).

### How should I set peak boundaries?

Use **Start** and **Length** to include the response until it returns to the baseline before the next injection. Check more than one injection, then use **Fit Peaks** or **Copy to next peak** to speed up repeated work. [See integration regions](https://ft-itc.org/manual/processing-thermograms#integration-regions).

### Do I need a buffer or dilution reference?

Use a matched reference when you collected one and want to compare background heat with the main experiment. If you did not collect one, continue with the main experiment and review the fitted result in context. [See Buffer Subtraction](https://ft-itc.org/manual/additional-tools#buffer-subtraction).

### Which binding model should I try first?

Start with the model that matches the experiment you performed. **One-Set-Of-Sites** is a useful first choice for one class of equivalent, independent sites; the manual describes the other available models and their inputs. [See the model reference](https://ft-itc.org/manual/fitting-models#models).

### What should I do if the curve or residuals look wrong?

Work backwards from the part of the curve that stands out: inspect the matching heat, peak region, baseline, and trace, then make one focused change and rerun the fit. If the application itself behaves unexpectedly, [contact Support](https://ft-itc.org/support).

---

## Further reading

- [Supported inputs and FT-ITC projects](https://ft-itc.org/manual/installation-files-projects#supported-input-formats)
- [Baseline, integration, and injection uncertainty](https://ft-itc.org/manual/processing-thermograms)
- [Single-experiment fitting and diagnostics](https://ft-itc.org/manual/fitting-models)
- [Multiple-experiment fitting and constraints](https://ft-itc.org/manual/multiple-experiments)
- [Advanced analysis and global fitting context](https://ft-itc.org/analysis)
