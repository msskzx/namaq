# Where this came from

`SKILL.md` is vendored from [backnotprop/pstack](https://github.com/backnotprop/pstack),
`skills/unslop/SKILL.md`, MIT licensed. `LICENSE` is that repository's copy.

One line differs from upstream. `disable-model-invocation` is `false` here,
where upstream sets it `true`. Upstream leaves the skill for a person to run by
hand. `AGENTS.md` asks every agent to apply it to every piece of prose, which
needs the agent able to invoke it.

To take an upstream revision, copy `skills/unslop/SKILL.md` over this one and
set that flag back to `false`.
