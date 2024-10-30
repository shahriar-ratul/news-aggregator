# RSS Feed Reader Project

A modern RSS feed reader built with Next.js, allowing users to aggregate and read content from various sources in one place.

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ (App Router)
- **Backend**: Node.js, NestJS
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Database**: PostgreSQL


## Run Database using Docker

```bash
docker compose up --build
```

## Stop Database using Docker

```bash
docker compose down
```

## Access Database using Docker

```bash
docker compose exec -it postgres_db psql -U postgres -d news_db
```

#RUN BACKEND

```bash
cd server
npm install
npm run start:dev
```

#RUN CLIENT

```bash
cd client
npm install
npm run dev
```
