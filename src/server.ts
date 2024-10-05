import app from './app';
import sequelize from './config/database';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swaggerConfig'; // Adjust the path as needed

const PORT = process.env.PORT || 3000;

// Swagger setup
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); // Đồng bộ mô hình với cơ sở dữ liệu
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

startServer();
