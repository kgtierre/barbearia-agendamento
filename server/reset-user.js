// server/reset-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetUser() {
  try {
    // 1. Conectar
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbearia_db');
    console.log('✅ Conectado ao banco:', mongoose.connection.name);
    
    // 2. Importar modelo
    const User = require('./src/models/User');
    
    // 3. DELETAR usuário existente (se houver)
    const deleteResult = await User.deleteOne({ email: 'cliente@teste.com' });
    console.log(deleteResult.deletedCount > 0 ? '🗑️  Usuário antigo removido' : '⚠️  Usuário não existia');
    
    // 4. Criar hash da senha "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    console.log('🔐 Hash da senha criado');
    
    // 5. CRIAR novo usuário
    const user = await User.create({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: hashedPassword,
      phone: '11966666666',
      role: 'cliente'
    });
    
    console.log('\n✅ USUÁRIO RECRIADO COM SUCESSO!');
    console.log('================================');
    console.log('📧 Email: cliente@teste.com');
    console.log('🔑 Senha: 123456');
    console.log('🆔 ID:', user._id);
    console.log('📞 Telefone: 11966666666');
    console.log('👤 Role: cliente');
    console.log('================================\n');
    
    // 6. VERIFICAR se realmente foi criado
    const verifyUser = await User.findOne({ email: 'cliente@teste.com' });
    console.log('🔍 Usuário verificado no banco:', verifyUser ? '✅ SIM' : '❌ NÃO');
    
    // 7. TESTAR login
    console.log('\n🧪 Testando login...');
    const isValid = await bcrypt.compare('123456', verifyUser.password);
    console.log(isValid ? '✅ Senha CORRETA - Login funcionará!' : '❌ Senha INCORRETA');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    if (error.code === 11000) {
      console.error('🚫 DUPLICATA: O usuário ainda existe! Execute NOVAMENTE este script.');
    }
    process.exit(1);
  }
}

resetUser();