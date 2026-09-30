# Mission

Reason for learning the source-extraction pipeline: **to evolve its design.**

Not to author batches by hand, and not to review an agent's output line by line.
The goal is to reason about the model itself — what a claim is allowed to back,
where the seam between a work's text and Namaq's structure sits, which parts of
the pipeline are load-bearing and which are conventions that could change.

## What this means for lessons

- Teach seams, not procedures. `npm run history:validate` is a fact to know;
  *why the validator checks paragraph counts* is the lesson.
- Every design claim cites the file or ADR that holds it, because a design
  argument that stands on nothing is the thing this repo already rules out for
  historical values.
- The success test is predictive: given a proposed change to the model, say what
  it would break and which rule already answers it.

## Origin

Grew out of a question the pipeline did not obviously answer: the Siyar's group
headings (شهداء بدر, السابقون الأولون) look like they hold a model value — that
someone was martyred at Badr — yet they have no prose to extract and no subject
to attach to. That is an eligibility question about the model, not an extraction
question, which is what set the mission here.
