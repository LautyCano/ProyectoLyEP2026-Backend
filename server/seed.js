const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Client = require('./models/clientModel');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('Error: La variable de entorno MONGO_URI no está configurada en .env');
      process.exit(1);
    }

    console.log('Conectando a MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log(`Conexión establecida con éxito a la base de datos: ${mongoose.connection.name}`);

    // Leer archivo de clientes simulados desde la carpeta documents/
    const clientsFilePath = path.join(__dirname, 'documents', 'clients.json');
    if (!fs.existsSync(clientsFilePath)) {
      throw new Error(`No se encontró el archivo de datos en ${clientsFilePath}`);
    }

    const rawData = fs.readFileSync(clientsFilePath, 'utf-8');
    const clientsData = JSON.parse(rawData);

    // Preparar los documentos limpiando campos temporales si existieran
    const clientsToInsert = clientsData.map((item) => {
      const { id, __v, ...clientWithoutId } = item;
      return clientWithoutId;
    });

    console.log(`Vaciando colección previa de clientes...`);
    const deleteResult = await Client.deleteMany({});
    console.log(`Documentos eliminados previamente: ${deleteResult.deletedCount}`);

    console.log(`Insertando ${clientsToInsert.length} clientes en la base de datos...`);
    const insertedClients = await Client.insertMany(clientsToInsert);

    console.log('----------------------------------------------------');
    console.log(`Migración completada con éxito!`);
    console.log(`Total de clientes insertados: ${insertedClients.length}`);
    console.log('Ejemplo de clientes cargados:');
    insertedClients.slice(0, 3).forEach((c, index) => {
      console.log(`  ${index + 1}. [${c.id}] ${c.name.firstname} ${c.name.lastname} - ${c.email}`);
    });
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    console.log('Conexión cerrada correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la ejecución del script de seed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

seedDatabase();
