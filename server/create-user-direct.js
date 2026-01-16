// server/create-user-direct.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createUserDirect() {
  try {
    // 1. Conectar SEM usar o modelo problemático
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbearia_db');
    console.log('✅ Conectado ao MongoDB');
    
    // 2. Criar hash da senha ANTES de inserir
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    // 3. Verificar se já existe
    const existing = await mongoose.connection.collection('users').findOne({
      email: 'cliente@teste.com'
    });
    
    if (existing) {
      console.log('⚠️  Usuário já existe. Removendo...');
      await mongoose.connection.collection('users').deleteOne({
        email: 'cliente@teste.com'
      });
      console.log('🗑️  Usuário antigo removido');
    }
    
    // 4. Inserir DIRETAMENTE na coleção
    const userData = {
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: hashedPassword, // JÁ HASHED
      phone: '11966666666',
      role: 'cliente',
      isActive: true,
      createdAt: new Date()
    };
    
    const result = await mongoose.connection.collection('users').insertOne(userData);
    
    console.log('\n========================================');
    console.log('✅ USUÁRIO CRIADO DIRETAMENTE NO BANCO!');
    console.log('========================================');
    console.log('📧 Email: cliente@teste.com');
    console.log('🔑 Senha: 123456');
    console.log('🆔 ID:', result.insertedId);
    console.log('========================================\n');
    
    // 5. Verificar
    const user = await mongoose.connection.collection('users').findOne({
      email: 'cliente@teste.com'
    });
    
    console.log('🔍 Usuário no banco:', user ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
    
    if (user) {
      console.log('📋 DETALHES:');
      console.log('   👤 Nome:', user.name);
      console.log('   📧 Email:', user.email);
      console.log('   📞 Telefone:', user.phone);
      console.log('   🏷️  Role:', user.role);
      console.log('   🔐 Hash presente:', user.password ? '✅ SIM' : '❌ NÃO');
      
      // Testar senha
      const isValid = await bcrypt.compare('123456', user.password);
      console.log('   🧪 Teste senha "123456":', isValid ? '✅ CORRETA' : '❌ INCORRETA');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    if (error.code === 11000) {
      console.error('🚫 Erro de duplicata. O índice unique ainda existe.');
    }
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

createUserDirect();