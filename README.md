# News App

Create client/.env
```
REACT_APP_FINNHUB=
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

Setup server
```
cd server
npx prisma generate
npx prisma db push
```

Start development client and server
```
npm run dev
```
