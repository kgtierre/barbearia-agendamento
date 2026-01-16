const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔗 Conectando ao MongoDB...");
    
    const mongoUri = "mongodb://127.0.0.1:27017/barbearia_db";
    
    // Configurações simplificadas (sem opções deprecated)
    const conn = await mongoose.connect(mongoUri);
    
    console.log("✅ MongoDB conectado com sucesso!");
    console.log(`📁 Banco: ${conn.connection.name}`);
    
  } catch (error) {
    console.error("❌ ERRO ao conectar MongoDB:");
    console.error("Mensagem:", error.message);
    
    // Não encerrar o app, apenas mostrar warning
    console.log("\n⚠️  Continuando sem banco de dados...");
    console.log("💡 Para conectar ao MongoDB, inicie em outro terminal:");
    console.log("   mongod --dbpath=\"C:\\data\\db\"");
  }
};

module.exports = connectDB;
