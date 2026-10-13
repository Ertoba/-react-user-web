#!/usr/bin/env bash
# MILI React production release; no backend/payment file changes.
set -Eeuo pipefail
cd /var/www/store_react
if [[ "$(git branch --show-current)" != main ]]; then echo 'STOP: expected main branch'; exit 1; fi
if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo 'STOP: tracked local modifications must be reviewed first'
  git status --short
  exit 1
fi
if [[ ! -x /usr/bin/yarn ]]; then echo 'STOP: Yarn not installed'; exit 1; fi
avail_kb=$(df -Pk . | awk 'NR==2 {print $4}')
if [[ "$avail_kb" -lt 4000000 ]]; then echo "STOP: only ${avail_kb} KiB free"; exit 1; fi
echo "AVAILABLE_KIB=$avail_kb"
git fetch origin main
git merge --ff-only origin/main
node --test tests/checkout-reels-routing.test.mjs
NEXT_TELEMETRY_DISABLED=1 yarn build
pm2 restart mili-react --update-env
pm2 save
pm2 status
curl -fsSI https://mili.ge/static/mili-mark-20261013.svg | head -10
printf '\nMILI_REACT_BRAND_DEPLOY=OK\n'
