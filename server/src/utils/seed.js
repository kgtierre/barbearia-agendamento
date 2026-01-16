const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// Conexão simples sem usar os models
const seedDatabase = async () => {
  try {
    console.log("🔗 Conectando ao MongoDB...");
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/barbearia_db");
    console.log("✅ Conectado ao MongoDB");
    
    // Obter modelos diretamente
    const db = mongoose.connection.db;
    
    // Limpar collections
    console.log("🧹 Limpando banco de dados...");
    await db.collection("users").deleteMany({});
    await db.collection("services").deleteMany({});
    await db.collection("barbers").deleteMany({});
    
    // Hash das senhas
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const barberPassword = await bcrypt.hash("barbeiro123", salt);
    const clientPassword = await bcrypt.hash("cliente123", salt);
    
    // Criar admin
    console.log("👑 Criando admin...");
    const adminUser = await db.collection("users").insertOne({
      name: "Admin Sistema",
      email: "admin@barbearia.com",
      password: adminPassword,
      phone: "11988888888",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    });
    
    // Criar barbeiro
    console.log("✂️  Criando barbeiro...");
    const barberUser = await db.collection("users").insertOne({
      name: "João Barbeiro",
      email: "joao@barbearia.com",
      password: barberPassword,
      phone: "11977777777",
      role: "barbeiro",
      isActive: true,
      createdAt: new Date(),
    });
    
    // Criar cliente
    console.log("👤 Criando cliente...");
    const clientUser = await db.collection("users").insertOne({
      name: "Cliente Teste",
      email: "cliente@teste.com",
      password: clientPassword,
      phone: "11966666666",
      role: "cliente",
      isActive: true,
      createdAt: new Date(),
    });
    
    // Criar perfil de barbeiro
    console.log("🛠️  Criando perfil do barbeiro...");
    const barberProfile = await db.collection("barbers").insertOne({
      user: barberUser.insertedId,
      specialty: "ambos",
      experience: 5,
      description: "Barbeiro com 5 anos de experiência, especialista em cortes modernos.",
      isActive: true,
      createdAt: new Date(),
    });
    
    // Criar serviços
    console.log("💈 Criando serviços...");
    const services = [
      {
        name: "Corte de Cabelo",
        description: "Corte tradicional com tesoura e máquina, finalização com pomada.",
        duration: 30,
        price: 35.0,
        category: "cabelo",
        isAvailable: true,
        createdAt: new Date(),
      },
      {
        name: "Barba",
        description: "Aparar e modelar barba, com toalha quente e finalização.",
        duration: 20,
        price: 25.0,
        category: "barba",
        isAvailable: true,
        createdAt: new Date(),
      },
      {
        name: "Corte + Barba",
        description: "Combo completo: corte de cabelo e barba com produtos premium.",
        duration: 50,
        price: 55.0,
        category: "combo",
        isAvailable: true,
        createdAt: new Date(),
      },
      {
        name: "Sobrancelha",
        description: "Design e manutenção de sobrancelhas.",
        duration: 15,
        price: 15.0,
        category: "estilo",
        isAvailable: true,
        createdAt: new Date(),
      },
    ];
    
    const createdServices = await db.collection("services").insertMany(services);
    
    console.log("\n✅ Banco de dados populado com sucesso!");
    console.log("========================================");
    console.log("👑 Admin:");
    console.log("  Email: admin@barbearia.com");
    console.log("  Senha: admin123");
    console.log("  ID:", adminUser.insertedId.toString());
    
    console.log("\n✂️  Barbeiro:");
    console.log("  Email: joao@barbearia.com");
    console.log("  Senha: barbeiro123");
    console.log("  User ID:", barberUser.insertedId.toString());
    console.log("  Barber Profile ID:", barberProfile.insertedId.toString());
    
    console.log("\n👤 Cliente:");
    console.log("  Email: cliente@teste.com");
    console.log("  Senha: cliente123");
    console.log("  ID:", clientUser.insertedId.toString());
    
    console.log("\n💈 Serviços criados (4 serviços)");
    
    console.log("\n🔗 IDs para testes:");
    console.log("  Barber ID para agendamentos:", barberProfile.insertedId.toString());
    console.log("  Service IDs:", Object.values(createdServices.insertedIds).map(id => id.toString()).join(", "));
    console.log("========================================");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao popular banco:", error.message);
    console.error("Stack:", error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
