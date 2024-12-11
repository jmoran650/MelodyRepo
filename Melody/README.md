# Startup instructions

Split terminals three times so that you can have a Frontend, Backend, and Database terminal. Do Database, then Backend, then Frontend.

! Perform these console commands starting from the rootfolder which is Melody, not MelodyRepo!
! Do the commands in this order, Database has to be up for Backend to connect, both need to be up for Frontend to connect to!

Database:
    cd Database
    docker-compose up -d

Backend:
    cd Backend
    npm install
    npm run build
    npm start

Frontend:
    cd Frontend
    npm install
    cd MelodyApp
    npm install
    npx expo start
