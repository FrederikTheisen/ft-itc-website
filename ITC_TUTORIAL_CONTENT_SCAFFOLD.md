# ITC tutorial content + information-architecture scaffold

> Working source document — not website copy. Fill the `[Fill in]` prompts in
> rough scientific language; accuracy is more useful than polish. Once the
> case details are here, this can be turned into a credible public tutorial
> without inventing experimental judgement or results.

## 1. Give the three existing page types distinct jobs

The current overlap is real: **Workflow**, **Tutorial**, and **Analysis** can
all sound like an instruction page. They should answer different questions.

| Page | Job | It should contain | It should not contain |
| --- | --- | --- | --- |
| **Workflow** | “What does FT-ITC support, and where does each stage of work happen?” | A concise product map: import, processing, fitting, export, supported file formats, and links onward. | A worked experimental narrative or advice presented as universally correct. |
| **Tutorials / worked examples** | “How was this *particular* ITC dataset interpreted, and why were those choices made?” | Real data, a stated experimental context, screenshots, decisions, rejected alternatives, fit checks, result and limitations. | A generic rewrite of the workflow or an unsupported claim of best practice. |
| **Advanced analysis** | “Which higher-order analyses can FT-ITC perform?” | Method/capability reference for global fitting, temperature/salt/proton linkage, uncertainty and reporting. | Step-by-step onboarding language or a second general tutorial. |

### Provisional navigation recommendation

Keep the primary navigation focused on product decisions, not three ways of
learning the same thing:

`Desktop app` · `Web viewer` · `Workflow` · `Advanced analysis` · `Download`

Put **Tutorials** in a Resources/learn area (and link to it prominently from
Workflow) until there are at least two or three genuinely data-led examples.
When the first example is ready, it can still be linked from Workflow without
occupying a permanent top-level navigation slot.

Suggested public labels:

- **Workflow** — *From instrument file to report*
- **Advanced analysis** — *Global fitting and thermodynamic models*
- **Worked examples** — reserved for real case studies, not generic guidance

### Decision for the current generic tutorial page

`/how-to-analyze-itc-data` should not be treated as the authoritative tutorial
until it is rebuilt from a real case below. It can become the first worked
example (or a short tutorials index), but it should not duplicate Workflow or
Advanced analysis. **No public-page restructuring is implied by this document;
that decision comes after the case content is supplied.**

---

## 2. Small tutorial series: the content that makes each guide distinct

Start with one complete, real dataset. The remaining pages can be added only
when their own evidence exists.

| Priority | Working tutorial | Central reader question | Minimum evidence needed |
| --- | --- | --- | --- |
| 1 | **From raw thermogram to defensible integrated isotherm** | “What did you actually inspect and change before fitting?” | A real run, experimental context, baseline/integration decisions, blank/background handling, and the resulting isotherm. |
| 2 | **Choosing and checking a binding model** | “Why is this model defensible for this dataset, and what would make it unsuitable?” | At least one competing model or constrained alternative, residuals, parameter interpretation, and limitations. |
| 3 | **Global analysis across a condition series** | “What can be shared across runs, what must vary, and what evidence supports the global fit?” | Multiple linked experiments with a stated shared-parameter scheme and comparison to individual fits. |
| 4 | **Uncertainty and reportable conclusions** | “How much confidence belongs to each fitted value and to the model itself?” | The selected uncertainty method, intervals/diagnostics, sensitivity to processing/model choices, and reporting language. |
| 5 | **Importing MicroCal and TA Instruments data** | “Can I bring my existing instrument files into FT-ITC, and what should I verify after import?” | Actual example files/screenshots for MicroCal `.itc` and TA/NanoAnalyze `.TA`, import checks, plus any caveats. |

The first guide should use the same case throughout rather than manufacturing a
new example for every stage. That makes the baseline, integrated heats, model,
and reported conclusion traceable to one another.

---

## 3. Fill-in brief: Tutorial 1 — raw thermogram to integrated isotherm

Copy this section when supplying the source material. Short notes, screenshots,
or links to local data are all fine. Do not smooth over uncertainty or choices
that were difficult — those are the useful parts of the tutorial.

### A. Editorial promise

- **Working title:** `[Fill in]`
- **One-sentence promise:** “By the end, the reader can `[specific outcome]`.”
- **Intended reader:** `[new ITC user / experienced MicroCal user moving to FT-ITC / etc.]`
- **What they already know:** `[Fill in]`
- **What this guide does *not* teach:** `[e.g. experimental design, protein preparation, all binding models]`
- **Search language a real reader would use:** `[Fill in 3–6 phrases]`

### B. The case behind the guide

- **Dataset/project name:** `[Fill in]`
- **Can it be public?** `[yes / anonymised / illustrative only]`
- **Source instrument and original file type:** `[MicroCal .itc / TA NanoAnalyze .TA / PEAQ .apj / other]`
- **FT-ITC version/build used:** `[Fill in]`
- **What interaction is being measured:** `[Fill in; disclose only what may be public]`
- **Why this run makes a useful example:** `[Fill in — e.g. modest drift, a questionable first injection, clear saturation, challenging baseline]`

#### Experimental context readers need to judge the analysis

- **Cell material and concentration:** `[Fill in]`
- **Syringe material and concentration:** `[Fill in]`
- **Buffer(s), pH, additives, salt:** `[Fill in]`
- **Temperature:** `[Fill in]`
- **Injection schedule:** `[number, volume, spacing, first-injection handling]`
- **Stirring / feedback / reference power, if material:** `[Fill in]`
- **Controls or blank titrations collected:** `[Fill in]`
- **Known deviations before processing:** `[Fill in]`

### C. Starting with the raw thermogram

Write what an experienced analyst could actually see, before changing a
setting. Avoid “the software fixes this” language.

- **Raw-trace observations:** `[Fill in: peak direction/size, baseline drift, equilibration, noisy injections, first-injection behaviour, saturation, mixing artefacts, etc.]`
- **Which injections were immediately suspicious, and why:** `[Fill in]`
- **What you checked before accepting the data:** `[Fill in]`
- **What remained uncertain at this stage:** `[Fill in]`
- **Screenshot / figure that proves the observation:** `[filename and what to look at]`

### D. Baseline choice — describe a decision, not a button

- **Baseline method used:** `[Fill in]`
- **Why it fits this trace:** `[Fill in: identify the relevant parts of the trace]`
- **Alternative considered:** `[Fill in]`
- **Why that alternative was rejected or retained as a sensitivity check:** `[Fill in]`
- **Exact adjustment(s):** `[Fill in; settings, regions, anchors, exclusions]`
- **What changed in the integrated heats after the adjustment:** `[Fill in]`
- **What result would have made you revisit the baseline:** `[Fill in]`
- **Screenshot annotation request:** `[e.g. circle the pre-injection drift; arrow to the fitted baseline near injections 13–18]`

### E. Injection integration and exclusions

- **How peak boundaries were chosen:** `[Fill in]`
- **Any injections excluded?** `[number(s), reason, and whether they were excluded from display, fit, or both]`
- **Was the first injection handled differently? Why?** `[Fill in]`
- **Background/dilution correction:** `[none / blank injection / fitted offset / other; explain why]`
- **Checks on the integrated sequence:** `[Fill in: monotonicity, scatter, late-injection behaviour, control comparison, etc.]`
- **What must not be inferred from the integrated curve alone:** `[Fill in]`

### F. Handoff to fitting

This first guide may stop before a full model comparison. State clearly what is
passed to the fitting stage and why it is ready — or why it is not yet ready.

- **Data entering the fit:** `[Fill in]`
- **Candidate model for this case:** `[Fill in]`
- **Reason this is only a candidate, not a conclusion:** `[Fill in]`
- **Parameters fixed, bounded, or shared:** `[Fill in]`
- **Fit checks shown in this guide:** `[residuals / concentration plausibility / stoichiometry / replicate agreement / other]`
- **Link or handoff to Tutorial 2:** `[Fill in]`

### G. The result — and its limits

- **What result can be reported from this example:** `[Fill in]`
- **Units, significant figures, and uncertainty convention:** `[Fill in]`
- **What conclusion is supported:** `[Fill in]`
- **What conclusion is *not* supported:** `[Fill in]`
- **Main sources of uncertainty or model dependence:** `[Fill in]`
- **What a reader should save/export:** `[project, processed trace, fit report, figure, settings, etc.]`

### H. Screenshot/figure map

For every visual, explain the scientific sentence it supports. A screenshot is
not decoration; it should let a reader verify a decision.

| Proposed asset | Use only if it supports this exact statement | Crop / annotation request | Final caption in your words |
| --- | --- | --- | --- |
| `avalonia-startscreen.png` | `[Fill in — optional onboarding only]` | `[Fill in]` | `[Fill in]` |
| `avalonia-processing.png` | `[Fill in — e.g. raw thermogram overview]` | `[Fill in]` | `[Fill in]` |
| `avalonia-processing-zoom.png` | `[Fill in — close-up of an issue/decision]` | `[Fill in]` | `[Fill in]` |
| `processing-baseline-linear.png` | `[Fill in — baseline rationale]` | `[Fill in]` | `[Fill in]` |
| `avalonia-processing-baselineoption.png` | `[Fill in — likely troubleshooting/sidebar]` | `[Fill in]` | `[Fill in]` |
| `analysis-basic.png` | `[Fill in — handoff to fit]` | `[Fill in]` | `[Fill in]` |
| `analysis-result.png` | `[Fill in — residual/result check]` | `[Fill in]` | `[Fill in]` |
| `finalfigure.png` | `[Fill in — reportable final figure]` | `[Fill in]` | `[Fill in]` |

**Cropping rule:** crop to the evidence, not just to fill a visual slot. Add an
arrow, bracket, or numbered callout only when the accompanying sentence says
exactly what the reader should inspect. Do not use an image if its dataset,
state, or significance cannot be explained honestly.

### I. Claims and review checklist

- **Every numerical result is traceable to:** `[raw file/project/figure]`
- **Every recommended setting is scoped to:** `[this trace / this data type / stated conditions]`
- **Compatibility claims verified with real files:** `[MicroCal .itc / TA .TA / other]`
- **Any feature names or interface labels to verify before publication:** `[Fill in]`
- **References, application notes, or internal validation to cite:** `[Fill in]`
- **Technical reviewer:** `[Fill in]`
- **Approval date/version:** `[Fill in]`

---

## 4. Briefs for the later guides

The following smaller briefs prevent the series from collapsing back into one
generic “how to analyse ITC data” page.

### Tutorial 2 — model selection and curve fitting

- **Same dataset as Tutorial 1, or a new case?** `[Fill in]`
- **Candidate models compared:** `[Fill in]`
- **Scientific reason each is plausible:** `[Fill in]`
- **Constraints / bounds / fixed concentrations:** `[Fill in]`
- **How residuals and parameter plausibility affected the decision:** `[Fill in]`
- **What the selected model cannot establish:** `[Fill in]`
- **Figure evidence:** `[Fill in]`

### Tutorial 3 — global analysis

- **Experiments joined in the analysis:** `[Fill in]`
- **Variable changed between runs:** `[temperature / salt / protonation / concentration / other]`
- **Parameters shared globally:** `[Fill in]`
- **Parameters allowed to vary:** `[Fill in]`
- **Why the sharing assumption is scientifically defensible:** `[Fill in]`
- **Comparison with individual fits:** `[Fill in]`
- **Failure mode / caveat to show:** `[Fill in]`

### Tutorial 4 — uncertainty and reporting

- **Uncertainty method actually used:** `[standard errors / bootstrap / profile likelihood / sensitivity analysis / other]`
- **What uncertainty source it captures:** `[Fill in]`
- **What it does not capture:** `[Fill in]`
- **Sensitivity tests performed:** `[baseline / excluded injection / concentration / model / other]`
- **Reporting template that follows from this case:** `[Fill in]`

### Tutorial 5 — MicroCal and TA/NanoAnalyze import

- **MicroCal file and instrument software used:** `[Fill in]`
- **TA/NanoAnalyze file and software used:** `[Fill in]`
- **What imports directly:** `[Fill in]`
- **Fields/units/settings to verify after import:** `[Fill in]`
- **Known import limitations or version caveats:** `[Fill in]`
- **Screenshots or sample files cleared for use:** `[Fill in]`

---

## 5. What to send back first

The smallest useful first delivery is not polished prose. Please fill these
five items for one real case:

1. The experimental context in **B**.
2. The raw-trace observations in **C**.
3. The baseline and integration decisions in **D–E**.
4. The supported result and limitations in **G**.
5. The one-sentence explanation for each image you want used in **H**.

Then the tutorial can be written as an honest walkthrough: observation →
decision → evidence → limitation. FT-ITC wording, layout, crops, annotations,
and internal links can be added afterwards without turning the page into an
invented laboratory protocol.
