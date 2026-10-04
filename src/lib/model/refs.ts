// docs/plans/data-model/plan.md, section 2.6
export function splitRef(ref: string) {
  const at = ref.indexOf('#');
  return at === -1 ? { span: ref } : { unit: ref.slice(0, at), span: ref.slice(at + 1) };
}
