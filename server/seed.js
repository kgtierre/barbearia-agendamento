const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Hash da senha "123456"
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123456', salt);

  const userData = {
    name: 'Cliente Novo',
    email: 'cliente@teste.com', // Use o email que deseja testar
    password: hashedPassword,
    phone: '11999999999',
    role: 'cliente'
  };

  // Substitua 'User' pelo caminho correto do seu modelo
  const User = require('./src/models/User');
  await User.create(userData);

  console.log('✅ Usuário criado com sucesso!');
  console.log('📧 Email: cliente@teste.com');
  console.log('🔑 Senha: 123456');
  mongoose.disconnect();
}

seed().catch(console.error);