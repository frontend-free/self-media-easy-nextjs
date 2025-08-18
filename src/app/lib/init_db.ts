import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    // 检查是否存在用户
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      const password = +new Date() + '';
      // 创建默认管理员用户
      await prisma.user.create({
        data: {
          name: 'admin',
          password,
          isAdmin: true,
          nickname: '管理员',
        },
      });
      console.log('默认管理员用户创建成功, 用户名: admin, 密码: ', password, '请及时修改密码');
    }
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export { initDatabase };
