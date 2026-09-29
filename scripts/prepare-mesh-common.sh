#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd .. && pwd)/mesh-common"
remote="https://github.com/baditaflorin/mesh-common.git"
ref="7fda31aa82603cb63414932b565173db281728aa"

if [ -e "$repo_dir" ]; then
  if [ ! -d "$repo_dir/.git" ]; then
    echo "refusing to use non-git path at $repo_dir" >&2
    exit 1
  fi
  current_remote="$(git -C "$repo_dir" remote get-url origin)"
  if [ "$current_remote" != "$remote" ]; then
    echo "refusing unexpected mesh-common origin" >&2
    exit 1
  fi
  git -C "$repo_dir" diff --quiet
  git -C "$repo_dir" diff --cached --quiet
  if [ -n "$(git -C "$repo_dir" ls-files --others --exclude-standard)" ]; then
    echo "refusing dirty mesh-common checkout" >&2
    exit 1
  fi
else
  git init --quiet "$repo_dir"
  git -C "$repo_dir" remote add origin "$remote"
fi

git -C "$repo_dir" fetch --depth 1 origin "$ref"
git -C "$repo_dir" checkout --detach FETCH_HEAD
actual="$(git -C "$repo_dir" rev-parse HEAD)"
if [ "$actual" != "$ref" ]; then
  echo "unexpected mesh-common revision: $actual" >&2
  exit 1
fi

npm --prefix "$repo_dir" ci
