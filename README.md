# Nft-Purchase-Alerts
A NodeJS + ExpressJS server to ingest NFT purchase events and send alerts.

## Run Instructions
First, create a db in local postgresql using pgAdmin or psql. Then, create a .env file in the server directory with the following variables and populate accordingly:
```
PORT=
NODE_ENV=development
DB_USER=
DB_NAME=
DB_HOST=
DB_PASSWORD=
DB_PORT=
# DB_URL=
```
    
Then, run the following commands:
```
cd server
npm i
npm run dev
```
DB gets seeded with mock data the first time server runs
For passing the 3rd and final rule, commends added to comment/uncomment relavant code in index.js to seed db properly.

## Test Instructions
```
cd server
npm i
npm run test
```