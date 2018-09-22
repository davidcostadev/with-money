#!/bin/bash

echo "Waiting for mysql"
until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

echo -e "\nmysql ready"

cd /usr/src/app
git pull origin master
npm install
cp .env.example .env
npm run sequelize db:migrate
npm run sequelize db:seed:undo:all
npm run sequelize db:seed:all
npm start