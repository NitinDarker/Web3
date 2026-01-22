# 07-cloud-wallet-be

To install dependencies:

```bash
bun install
```

To run:

```bash
# Start Postgres locally (using docker)
docker run -p 5432:5432 -v sol-wallet-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=nitin111 --name sol-wallet postgres
```

```bash
bun run dev
```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
