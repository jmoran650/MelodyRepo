Startup instructions:

Split terminals three times so that you can have a Frontend, Backend, and Database terminal. Do Database, then Backend, then Frontend. 

!Perform these console commands from the rootfolder which is Melody, not MelodyRepo!

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

