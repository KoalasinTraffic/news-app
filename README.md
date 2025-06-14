# News App

Create client/.env
```
VITE_API_URL="http://localhost:5000"
VITE_FINNHUB=xxxxxxxxx
```

Create server/.env
```
DATABASE_URL="postgresql://<username>:<password>@<database>"
ADDR="0.0.0.0"
PORT="5000"
JWT_SECRET=<node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
```

Run dependency installation script
```
npm install
npm run install
```

Start development client and server
```
npm run dev
```
