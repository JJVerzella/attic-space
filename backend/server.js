const express = require('express');
const cors = require('cors');
require('dotenv/config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const connect = require('./configs/db');

const app = express();


const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "AtticSpace REST API",
            version: "1.0.0",
            description: "Cloud-based File Storage and Collaboration Tool",
        },
        servers: [
            {
                url: `${process.env.BASE_URL}:${process.env.PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(options);

app.use(cors({
    origin: `${process.env.BASE_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/files', fileRoutes);

if (require.main === module) {
    connect();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

module.exports = app;
