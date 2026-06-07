# Trae Preflight

This folder is prepared for `wangxt-819-1`.

Use `.env` for stable local ports and compose project identity:

- APP_PORT: 18119
- API_PORT: 19119
- WEB_PORT: 20119
- DB_PORT: 21119
- REDIS_PORT: 22119

Smoke entry:

```bash
bash scripts/smoke.sh
```

The preflight files are environment scaffolding only. The generated business
project can replace or extend them when needed.
