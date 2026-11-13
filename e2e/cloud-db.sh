#!/usr/bin/env bash
# A local Postgres holding the surahs and ayat, for a cloud container with no .env. Run from the repo root, then
# export the two URLs it prints before `npm run test:ui`.
set -euo pipefail
URL=postgresql://postgres:postgres@127.0.0.1:5432/namaq
service postgresql start >/dev/null
su postgres -c "psql -qc \"ALTER USER postgres PASSWORD 'postgres'\""
su postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname = 'namaq'\"" | grep -q 1 || su postgres -c "createdb namaq"
export DATABASE_URL=$URL DATABASE_URL_UNPOOLED=$URL
npx prisma db push --skip-generate >/dev/null
dir=$(mktemp -d)
(cd "$dir" && npm pack --silent quran-json@3.1.2 >/dev/null && tar xzf quran-json-3.1.2.tgz)
npx tsx e2e/web/seedQuran.mts "$dir/package/dist/quran.json"
echo "export DATABASE_URL=$URL DATABASE_URL_UNPOOLED=$URL"
