#!/usr/bin/env bash
# Reset `main` to its initial commit and remove every other branch (local + remote).
# WARNING: destructive — discards uncommitted changes, all non-main branches,
# and rewrites history on origin/main.

set -euo pipefail

git rev-parse --git-dir > /dev/null

INITIAL_COMMIT=$(git rev-list --max-parents=0 main | tail -n 1)
echo "Initial commit on main: $INITIAL_COMMIT"

git checkout -f main
git reset --hard "$INITIAL_COMMIT"

LOCAL_BRANCHES=$(git for-each-ref --format='%(refname:short)' refs/heads \
  | grep -v '^main$' || true)
if [ -n "$LOCAL_BRANCHES" ]; then
  echo "Deleting local branches:"
  echo "$LOCAL_BRANCHES"
  echo "$LOCAL_BRANCHES" | xargs git branch -D
fi

REMOTE_BRANCHES=$(git for-each-ref --format='%(refname:short)' refs/remotes/origin \
  | sed 's|^origin/||' \
  | grep -Ev '^(HEAD|main)$' || true)
if [ -n "$REMOTE_BRANCHES" ]; then
  echo "Deleting remote branches:"
  echo "$REMOTE_BRANCHES"
  echo "$REMOTE_BRANCHES" | xargs git push origin --delete
fi

git remote prune origin
git push --force-with-lease origin main

echo "Done. main is at $INITIAL_COMMIT, all other branches removed."
