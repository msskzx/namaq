/**
 * Which side the next tree should slide in from. Set just before stepping to a neighbouring tree,
 * read once by the tree that mounts next, so the new tree arrives from the side the old one left towards.
 */
let entering: { forward: boolean; at: number } | null = null;

export function noteStep(forward: boolean) {
  entering = { forward, at: Date.now() };
}

export function takeEntering() {
  const step = entering;
  entering = null;
  // A step that never opened a tree (a new tab, a failed load) must not slide in a later, unrelated tree.
  return step && Date.now() - step.at < 5000 ? step.forward : null;
}
