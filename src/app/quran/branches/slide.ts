/**
 * Which side the next tree should slide in from. Set just before stepping to a neighbouring tree,
 * read once by the tree that mounts next, so the new tree arrives from the side the old one left towards.
 */
let entering: boolean | null = null;

export function noteStep(forward: boolean) {
  entering = forward;
}

export function takeEntering() {
  const forward = entering;
  entering = null;
  return forward;
}
