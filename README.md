# portfolioV2

Personal site for Jonathan Lindqvist.

## Docker

```bash
docker compose up -d --build
```

The container listens on `127.0.0.1:8080` by default so it can sit behind a shared reverse proxy on the same VPS. If you are running another app on a different domain, give that app its own local port and point your proxy at both services.

If you prefer to run the container directly:

```bash
docker build -t portfolio-v2 .
docker run --rm -p 8080:80 portfolio-v2
```
