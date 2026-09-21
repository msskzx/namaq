-- How the source places a person among the clans: النمري, الفهري, حليف بني
-- زهرة. Ibn Ishaq uses a حلف the way he uses a nisba, to tell forty names
-- apart in one roster, so it is a name and not a relationship -- the same call
-- ADR 0014 made for a kunya. Text here means the graph grows no Tribe node,
-- which every person in the app would otherwise need an edge to.
ALTER TABLE "persons" ADD COLUMN "tribalAffiliation" TEXT;
