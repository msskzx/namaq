# Namaq

Namaq helps learners understand people in Islamic history through their recorded
relationships and historical context.

## Language

### Graph exploration

**Exploration**:
A learner's growing view of historical subjects and their recorded
relationships, built by following connections between them.
_Avoid_: Current graph (the panel's UI label for this same concept)

**Graph map**:
The shared arrangement of all historical subjects and their recorded
relationships. Each exploration reveals a subset of this map, with subjects
occupying the same positions regardless of how they are reached.

**Show full graph**:
An action within an exploration that reveals the entire historical graph
without switching to a separate view.
_Avoid_: Overview (the separate view this action replaced)

**Show additions**:
An action that brings subjects revealed by an expansion or global relationship
filter into view together with their connecting subjects.

**Selected person**:
The person whose relationships the learner is currently inspecting or choosing
to expand.
_Avoid_: Starting person (the selection can change during an exploration)

**Historical subject**:
A person, title, battle, or event recorded in the relationship graph, whether
or not any exploration has revealed it. This is the set that search looks
through.
_Avoid_: Node, entity (both name the storage representation rather than the
thing recorded)

**Exploration subject**:
A historical subject an exploration has revealed, whose recorded connections
the learner can inspect and expand. A selected person is a person chosen as
the current subject.

**Expansion**:
The revelation of subjects through a selected subject's chosen relationships.
Each subject's expansion choices are independent, and the exploration
retains subjects already revealed while further expansions add to it.
_Avoid_: Global relationship filter (the same relationship choices applied
with no subject selected, see below)

**Relationship type**:
The kind of recorded connection between two subjects, such as Father or
Wife, independent of any selected subject's perspective.
_Avoid_: Expansion relation, connection description (both describe a
relationship type from a particular subject's perspective)

**Expansion relation**:
The role of the relative or connected subject being revealed with respect to
the selected subject. For example, Father requests the selected person's father.

**Global relationship filter**:
A relationship type applied with no subject selected: it shows every
recorded connection of that type between subjects already in the
exploration, and introduces one hop of matching subjects for anyone present
who lacks theirs. Shares its relationship definitions with Expansion; only
the scope differs.
_Avoid_: Expansion (the subject-scoped counterpart)

**Filter-introduced subject**:
A subject added to the exploration by a global relationship filter's
automatic introduction, as distinct from a subject added by search,
selection, or an expansion.

**Introduction cap**:
The rule that a filter-introduced subject can never itself trigger the
same global relationship filter's automatic introduction again. Applies
per relationship type, not across all filters, and does not restrict
manually selecting and expanding a capped subject. The cap lasts for the
exploration, even if the subject is independently revealed or removed and
reintroduced; Start over begins a new exploration.

**Connection description**:
A statement of the first subject's relationship to the second subject. With
Aisha first and Abu Bakr second, that relationship is Daughter, even when the
connection was revealed through Aisha's Father expansion.
_Avoid_: Expansion relation (which describes the subject being requested)

**Collapse**:
The removal of one expansion's or global relationship filter's contribution
to an exploration. Subjects independently searched, expanded, or introduced
through another expansion or filter remain.

**Node type**:
The kind of historical subject represented in the graph: person, title, battle,
or event.
_Avoid_: Relationship type (which describes a connection between subjects)

**Explore**:
Reveals the selected subject's immediate connections of the relationship types
currently enabled, without following those neighbors onward through further
generations or other subjects. See
[ADR 0007](docs/adr/0007-filters-choose-the-relationship-vocabulary.md).
_Avoid_: All direct relations (the former name, which promised every recorded
type regardless of the switches); ancestors, descendants (both continue across
generations)

### Lineage

**Ancestors**:
A person's parents and the earlier generations reached through either parent's
recorded parentage.
_Avoid_: Paternal lineage (when both sides are meant)

**Paternal lineage**:
The chain consisting of a person's father, their father's father, and so on.
This is the specific meaning intended by the Nasab option in graph exploration.
The action still restores from a saved URL, but has no button while its future
is undecided.
_Avoid_: Ancestors (when only the father-to-father chain is meant)

**Descendants**:
A person's children and the later generations reached through their children's
recorded parentage.

### Historical evidence

**Historical source**:
A historical work used as evidence for information about a historical subject,
including the edition consulted.

**Digital host**:
A website that makes a historical source available to read, such as Islamweb.

**Historical claim**:
An assertion about a historical subject or a recorded relationship that can be
supported or challenged by evidence.

**Citation**:
A reference connecting a historical claim or biographical passage to the exact
source location used, including its extraction link when read online.

**Source account**:
The complete entry about a historical subject in a particular work and edition,
with its accompanying notes kept attributable to their authors. Different works
can provide separate source accounts of the same subject.

**Focal subject**:
The historical subject whose source account defines the scope of a review batch.
Supporting subjects and relationships may be included when its account requires
them.

**Review batch**:
A group of proposed historical data changes and their evidence centered on one
focal subject. It may include supporting subjects and relationships needed to
make that subject's change coherent.

**Review status**:
The stage of editorial checking recorded for historical information, shown to
readers independently of whether that information is publicly available.

**Canonical historical record**:
The subject value or relationship Namaq currently selects for presentation.
New selections trace to historical claims even when other claims disagree.
_Avoid_: Historical truth, source text

**Legacy historical record**:
Structured historical information retained from before source-backed authoring,
with no recorded evidence and no claim of review until it is researched later.
_Avoid_: Canonical evidence, verified data

**Source-backed change**:
An addition or change to a canonical historical record that identifies the
historical claims and citations supporting it.
_Avoid_: Sourced file, database edit

**Evidence role**:
How a cited passage bears on a historical claim: direct evidence, a transmitted
report, a synthesis, or editorial analysis. It describes the passage, not the
digital host or the work as a whole.
_Avoid_: Source quality, website type

### People and search

**Graph-only person**:
A person present in the relationship graph with no PostgreSQL profile row --
findable by name and explorable like any other person, but with no profile
page to view, since there is no profile content recorded for them. Deep
lineage-only ancestors are the common case.
_Avoid_: Profile-less person, unverified person (both imply something is
missing or wrong, rather than simply not yet recorded)
