const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const authRoutes = require('./routes/auth');
const residentRoutes = require('./routes/residents');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/residents', residentRoutes);
app.use('/complaints', complaintRoutes);
app.use('/admin', adminRoutes);

// Swagger
const swaggerDoc = require(path.join(__dirname, '..', 'resources', 'swagger.json'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Health
app.get('/', (req, res) => res.json({ message: 'Denúncias API - running' }));

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
