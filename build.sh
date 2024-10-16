#!/bin/bash

cd frontend
    npm install
    npm run build
cd ..

npm install 
npm run build 
npm run sequelize --prefix backend db:seed:undo:all 
npm run sequelize --prefix backend db:migrate:undo:all 
npm run sequelize --prefix backend db:migrate 
npm run sequelize --prefix backend db:seed:all