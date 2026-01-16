const app = require("./src/app");
const connectDB = require("./src/config/database");

// Conectar ao MongoDB (se estiver disponível)
try {
  connectDB();
} catch (error) {
  console.log("⚠️  MongoDB não conectado, continuando sem banco...");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Modo: ${process.env.NODE_ENV}`);
  console.log(`⏰ Iniciado em: ${new Date().toLocaleString()}`);
});
