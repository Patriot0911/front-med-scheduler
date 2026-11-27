# Rules — entry point

This file is only a map. The rules live in the files below; each file covers one topic, every rule is written in exactly one place, and CLAUDE.md, skills and agents link to it instead of repeating it.

Claude Code always loads files without `paths`; files with `paths` load when a task touches matching files. If a task concerns a topic but no matching file has been opened yet (a question, a plan), read the relevant rule file yourself. Subagents read the files they need explicitly, using this map.

| Context | File |
|---|---|
| Always: git — commits, push, staging, working tree | [git.md](git.md) |
| Always: actions outside the working tree (server, image registry, GitHub), destroying data, secrets | [operations.md](operations.md) |
| Any code change in `src/`: comments | [comments.md](comments.md) |
| API services, query / mutation hooks, interfaces | [api-layer.md](api-layer.md) |
| UI kit (`components/ui`) | [ui-kit.md](ui-kit.md) |
| Styles (`*.scss`) | [styles.md](styles.md) |
| Texts and i18n (JSX, configs, zod schemas) | [texts.md](texts.md) |

New rule file → add a row to this table. Project docs (CLAUDE.md, READMEs) stay in Ukrainian.
