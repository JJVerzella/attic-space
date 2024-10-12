const express = require('express');
const cors = require('cors');
require('dotenv/config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const io = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const documentRoutes = require('./routes/documentRoutes');
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
                url: `${process.env.BASE_URL}:${8000}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(options);

app.use(cors({
    origin: '*',
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/documents', documentRoutes);

if (require.main === module) {
    connect();
    const PORT = 8000;  // parseInt(process.env.PORT) || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    const instance = io(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
        }
    });

    instance.on('connection', socket => {
        socket.on("documentUpdated", delta => {
            socket.broadcast.emit('documentChanges', delta);
        });

        socket.on("joinRoom", ({ documentId }) => {
            if (documentId) {
                socket.join(documentId);
                socket.to(documentId).emit(
                    'joined', 'Welcome another one!');
            }
        });
    });
}

module.exports = app;
