# Operations and secrets

- Without the user's explicit consent — no actions outside the local machine: `ssh` and anything on the production server, `docker push` / publishing images, changes in GitHub via `gh` (secrets, variables, environments, running workflows, PRs, comments, releases).
- Actions that destroy data — only on direct request: `docker volume rm`, `docker system prune`, deleting or wiping any database.
- Never print secrets (`.env`, tokens) in replies or write them into files tracked by git. Only examples with placeholders go to git.
