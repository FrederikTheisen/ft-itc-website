---
page: /how-to-analyze-itc-data
title: "How to Analyze ITC Data: From Thermogram to Binding Parameters"
description: "A practical FT-ITC Analysis guide from raw thermogram to fitted result."
author: "Frederik Theisen · FT-ITC Analysis"
last_updated: "2026-08-26"
status: "Editable content source — not rendered automatically"
---

# How to Analyze ITC Data: From Thermogram to Binding Parameters

This guide follows the normal FT-ITC Analysis workflow: open an experiment, look at the thermogram, set a baseline, integrate the peaks, fit a model, and make a clear figure or result table. Start with the straightforward route, look at what changes on screen, and refine the analysis when the data give you a reason to.

> **How to edit this file**
>
> Edit the headings, prose, lists, links, image captions, and image choices in plain Markdown. The website will keep its visual layout when this is translated back to HTML. If you want a different image crop or annotation, write a short note directly beneath the image. When you are ready, say “sync the tutorial Markdown” and I will apply your edited content to the website page.

> **A practical first pass**
>
> The screenshots show where the relevant controls live. Open a copy of your own project, try the first-pass settings, and compare the trace, integrated heats, fitted curve and residuals as you go.

## The short version

1. **Open and check the experiment.** Confirm the sample, titrant, concentrations, temperature and injection settings.
2. **Look at the thermogram.** Get a feel for peak shape, baseline behaviour and the overall progression of the experiment.
3. **Set the baseline and integrate.** Start simply, inspect a few peaks closely, then review the full heat series.
4. **Use a reference when you have one.** Apply a buffer or dilution correction if it is part of the experiment.
5. **Fit, compare and export.** Run a sensible first model, inspect the curve and residuals, then save and report the result.

---

## 1. Import and experiment context

### Open the experiment and verify what the file contains

Start by checking what you imported and the experiment details that go with it. The workflow moves from raw power trace, to integrated heats, to a fitted isotherm.

#### Raw thermogram

The thermogram records differential power over time. Each injection produces a peak whose direction and size depend on the heat associated with the experiment and the instrument convention.

#### Integrated heats

Peak integration assigns an area to each injection after baseline handling. Those values can contain binding heat as well as mixing, dilution, buffer mismatch, temperature-equilibration and other contributions.

#### Binding isotherm and parameters

The integrated heats are plotted against a concentration or molar-ratio coordinate to form a binding isotherm. A selected model then estimates quantities such as _K_<sub>d</sub> or _K_<sub>a</sub>, stoichiometry and enthalpy. These are model-dependent estimates, not direct readings from the raw trace.

When you import an experiment, check the cell and syringe identities, concentrations, temperature, buffer, injection volume and spacing. These values set the molar-ratio axis and are part of the fit.

> **Choose the right starting point**
>
> - **Raw thermogram inputs:** MicroCal-style `.itc`, TA NanoITC `.nitc`, NanoAnalyze `.ta`, and PEAQ-ITC `.apj` open into the thermogram-processing workflow.
> - **Integrated-heats inputs:** compatible `.dat`, `.aff` and `.dh` files begin with experiment details and fitting.
> - **Project inputs:** `.ftxtc` and legacy `.ftitc` reopen an FT-ITC project.
>
> [Read the full file-format reference](https://ft-itc.org/manual/installation-files-projects#supported-input-formats)

![FT-ITC Analysis welcome screen with an Open File button](media/tutorials/processing-and-analysis/avalonia-startscreen.webp)

*Start with **Open File…**, then check the experiment context before changing the data.*

<!-- Website layout note: a compact crop focuses on the Open File control. -->

---

## 2. Thermogram processing

### Inspect the thermogram before changing it

Start with the whole trace. Look at the direction and shape of the peaks, how the baseline behaves between injections, whether the signal returns, and how the series changes as the titration progresses.

Then zoom in on a few peaks. The first injection may look different from the later ones, and some traces will need more time to recover between injections. That is useful information: see how the baseline and integration window behave before deciding whether to change anything.

The processing view is made for trying small adjustments and seeing their effect. Keep the original file or a saved copy of the project so you can compare a revised processing choice with your starting point.

[Read the processing controls in the manual](https://ft-itc.org/manual/processing-thermograms)

![FT-ITC Analysis Process Data workspace with a black thermogram trace, red baseline and processing controls](media/tutorials/processing-and-analysis/avalonia-processing.webp)

*In the Process Data workspace, read the black thermogram trace, red baseline and processing controls together.*

<!-- Website layout note: use a wide crop that keeps the trace, red baseline, and right-hand controls legible. -->

---

## 3. Baseline correction

### Start with a useful baseline

The baseline estimates the non-injection power underneath the peaks. Start with the simplest baseline that follows the quiet regions of the trace, then see how the integrated heats look.

#### Choose a representation that matches the observed drift

Try **Polynomial** for smooth global drift, **Spline** when you want to place and edit points directly, or **Segmented** when different parts of the trace need local treatment. There is no need to guess perfectly at the start: compare the result with the trace and refine only where it helps.

#### Anchor the baseline in usable regions between peaks

Place the baseline in the parts of the trace between peaks where the instrument has settled. With a Spline, the editable points make the choice easy to see and adjust.

#### Check what a changed boundary also changes

When **Discard integrated regions** is enabled, moving an integration boundary can change both the integrated area and the recalculated baseline. Check the trace and the heat series together after a larger adjustment.

![Close view of an ITC thermogram with a red baseline and editable control points](media/tutorials/processing-and-analysis/processing-baseline-linear.webp)

*The red baseline and control points make the local processing choice visible. Start by matching them to the trace.*

<!-- Website layout note: use a close, near-square crop centred on the baseline and control points. -->

---

## 4. Peak integration

### Integrate the peaks and look at the series

Integration turns the processed thermogram into the heats used for fitting. Start with the default regions, then inspect a few selected peaks before applying the same approach across the series.

#### Inspect the Start and Length boundaries

Use the selected-peak view to check that the interval captures the response and settles before the next event. It is worth looking at an early, middle and late injection rather than judging the whole run from one peak.

#### Try the endpoint tools

**Fit Peaks** can estimate the end point from the peak decay. It is a quick way to get started, and you can still adjust any endpoint afterwards. **Copy to next peak** is useful when neighbouring peaks need the same treatment.

#### Keep integration choices separate from fit exclusions

In **Analyze Data**, you can leave an injection out of the fit while keeping it visible on the graph. If you change which injections are included, choose **Run Fit** again to update the curve and parameters.

After integration, review the complete heat series against the thermogram. Look for a sensible progression across the titration, obvious outliers, and anything worth checking again before fitting.

[Read about integration regions and processing-derived error](https://ft-itc.org/manual/processing-thermograms#integration-regions)

![Selected ITC injection with a blue integration window and calculated injection heat](media/tutorials/processing-and-analysis/avalonia-processing-zoom.webp)

*The blue interval is one selected injection. Use it to check the local integration decision, then review the same rule across the series.*

<!-- Website layout note: use a close crop focused on the selected injection, blue interval, and measured heat. -->

---

## 5. Background heat

### Use a buffer or dilution reference when you have one

If you collected a matched buffer or dilution reference, use it to look at the background heat alongside the main experiment. FT-ITC Analysis can apply that correction and keep the original integrated heats in the project.

> **A simple way to start**
>
> Begin with **Matched** when the reference follows the same injection schedule. **Linear** and **Exp. decay** are useful alternatives when the reference heat changes across the run. Compare the corrected heat series with the original and use the option that makes sense for the reference you collected.
>
> [Read the buffer-subtraction workflow](https://ft-itc.org/manual/additional-tools#buffer-subtraction)

---

## 6. Binding-model fitting

### Start with a sensible binding model

Open **Analyze Data** in **Single experiment** mode once the integrated heats and experiment details are ready. The screen shown here uses **One-Set-Of-Sites**, a useful first model for one class of equivalent, independent sites.

FT-ITC Analysis also includes **Two-Sets-Of-Sites**, **Competitive Binding** and **Dissociation** models. Start with the model that fits the experiment you performed, then compare alternatives if the first result leaves something unexplained.

The fit uses the included injections together with concentrations, injection volumes, cell volume, temperature and model-specific information. Check the units, concentrations and starting values, then choose **Run Fit**. The graph updates with the fitted curve, residuals and parameter values so you can see what the model is doing.

For two or more processed **Active** experiments, **Multiple experiments** can fit the runs together. You can leave parameters separate, set them **Same for all**, or use a supported **Temperature dependent** relationship. It is a useful next step when the experiments belong to the same series.

[Read the documented model assumptions](https://ft-itc.org/manual/fitting-models#models)

![FT-ITC Analysis Analyze Data workspace showing a One-Set-Of-Sites fit, residuals and Bootstrap residuals settings](media/tutorials/processing-and-analysis/analysis-basic.webp)

*The fit view puts the selected model, isotherm, residuals, weighting and error method in one place.*

<!-- Website layout note: use a wide crop that keeps model selection, isotherm, residuals, weighting, and the error method readable. -->

---

## 7. Fit quality and uncertainty

### Look at the fit, residuals and uncertainty together

The fit view brings the heats, curve, residuals and parameter values together. Use it to see how well the model follows the experiment and where a different processing or fitting choice might be worth trying.

#### Look for structure in the residuals

Residuals show the difference between the integrated heats and the fitted curve. A quick look often reveals whether the model follows the series evenly or misses a part of the titration.

#### Know what injection-error weighting represents

For processed thermograms, FT-ITC can estimate an error bar for each injection. **Weight by injection error** uses those estimates during fitting, which can be helpful when some peaks are noticeably noisier than others.

#### Try an uncertainty calculation

Choose **Bootstrap residuals** when you want repeated residual-based refits, or **Leave-one-out** when you want to see how the result changes as individual included injections are omitted. The result view shows the completed calculation and the resulting intervals.

#### Compare a few sensible alternatives

If a result seems sensitive, try one change at a time: a different baseline, a revised integration boundary, a different included point, a reference correction or another model. Comparing these runs is often more informative than trying to decide everything in advance.

[Read the uncertainty and diagnostic definitions](https://ft-itc.org/manual/fitting-models#parameter-uncertainty)

![FT-ITC Analysis fitted-result view showing parameter intervals, residuals and BootstrapResiduals completion status](media/tutorials/processing-and-analysis/analysis-result.webp)

*Review fitted values and intervals beside the residual plot and the bootstrap-refit counts.*

<!-- Website layout note: keep the parameter intervals, residuals, and bootstrap status line legible. -->

---

## 8. Reporting

### Save and export the result

A clear figure makes it easy to see the thermogram, integrated heats, fitted curve and residuals together. FT-ITC keeps these views available while you prepare the result.

Save the project as `.ftxtc` once you have a useful processing checkpoint, then save again after fitting so the solution and any Analysis Result travel with the project.

Use **Final Figure** to compose an experiment figure and export its PDF. Use **Analysis Result Exporter...** for result tables, or **Export Integrated Peaks** when the injection-level heats are the useful output.

[Read the figures and export guide](https://ft-itc.org/manual/figures-printing-export)

> **Before you export**
>
> Check the labels, units, fit and residuals. The project keeps the analysis together, so you can return to the same processing and fitting choices later.

![FT-ITC Analysis Final Figure workspace showing a thermogram, fitted binding isotherm, residuals and PDF export controls](media/tutorials/processing-and-analysis/finalfigure.webp)

*Before selecting **Export PDF**, make sure the thermogram, fitted isotherm, residuals, labels and parameter box all describe the same processed result.*

<!-- Website layout note: use a wide crop that keeps the full assembled figure and Export PDF control in view. -->

---

## If something looks off

### Baseline drift or slow recovery

Try a different baseline type or inspect the quiet regions between peaks more closely. If the trace is slow to recover, it can also be useful to look at the injection spacing.

### Noisy, overlapping or irregular peaks

Zoom in on the affected peaks and adjust the integration boundaries if needed. You can also see how the fit changes when a clearly problematic point is left out and the fit is rerun.

### Poor saturation or unstable parameters

Check the concentrations, the range covered by the titration and the signal size. Then try a different starting value or a different model if it matches the experiment better.

### Systematic residuals

Go back to the heat series and thermogram, then try one alternative baseline, integration choice or model. The comparison usually points to the most useful next step.

---

## Frequently asked questions

### How do I analyse ITC data?

Open the experiment, inspect the thermogram, set a baseline, integrate the peaks, fit a model, look at the residuals, and save or export the result. Work through the steps in order and use the visible graphs to guide the next adjustment.

### Why is ITC baseline correction important?

The baseline sets the reference level underneath each peak, so it affects the integrated heats. Use the trace to place it, then look at how the heat series changes if you try a different baseline treatment.

### Do I need ITC buffer subtraction or dilution correction?

If you collected a matched buffer or dilution reference, compare it with the main experiment and use the buffer-subtraction tool. If you did not collect one, continue with the main experiment and inspect the fitted offset in context.

### What should ITC residuals look like?

Residuals should sit reasonably evenly around zero. If one part of the plot stands out, go back to the corresponding heats or thermogram and try a focused adjustment.

### Which ITC file formats can FT-ITC Analysis open?

FT-ITC Analysis opens MicroCal-style raw `.itc` files, TA NanoITC `.nitc` files and NanoAnalyze `.ta` exports for thermogram processing. PEAQ-ITC `.apj` imports restore raw thermogram and injection information from the first experiment; reprocess and refit that data in FT-ITC Analysis. Compatible `.dat`, `.aff` and `.dh` inputs are integrated heats, while `.ftxtc` and legacy `.ftitc` reopen FT-ITC projects. See the [manual's file-format reference](https://ft-itc.org/manual/installation-files-projects#supported-input-formats).

---

## Further reading

- [Supported inputs and FT-ITC projects](https://ft-itc.org/manual/installation-files-projects#supported-input-formats)
- [Baseline, integration and injection uncertainty](https://ft-itc.org/manual/processing-thermograms)
- [Single-experiment fitting and diagnostics](https://ft-itc.org/manual/fitting-models)
- [Multiple-experiment fitting and constraints](https://ft-itc.org/manual/multiple-experiments)
- [Advanced analysis and global fitting context](https://ft-itc.org/analysis)
