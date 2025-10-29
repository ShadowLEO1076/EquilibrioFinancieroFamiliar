// este archivo se encarga de iniciar los servicios necesarios para la aplicación

start cmd.exe /k "cd "C:\Program Files\MongoDB\Server\8.2\bin" && mongod.exe --dbpath C:\data8\db"

start cmd.exe /k "cd C: \ Node\Blog-node && npm start"

start cmd.exe /k "Users \ netstat -ano | findstr :3001"
