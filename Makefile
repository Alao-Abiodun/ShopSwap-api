start_db:
	docker-compose up -d

stop_db:
	docker-compose down

server:
	yarn dev

deploy_server:
	yarn deploy

migrate:
	db-migrate up

migrate_down: 
	db-migrate down 

create_migration:
	db-migrate create $(n) --sql-file

.PHONEY: start_db stop_db server migrate migrate-down create_migration deploy_server