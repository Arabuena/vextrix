const cors = require('cors');

app.use(cors({
  origin: [
    'https://vextrix.vercel.app',
    'http://localhost:5173', // para desenvolvimento local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); 