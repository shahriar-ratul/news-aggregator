host.docker.internal

docker compose up --build

docker compose down

docker compose exec -it postgres_db psql -U postgres -d news_db