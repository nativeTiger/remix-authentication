import bcrypt from "bcryptjs";
import prismadb from "~/utils/prismadb";

export async function getUserById(id: string) {
  return prismadb.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prismadb.user.findUnique({ where: { email } });
}

export async function deleteUserById(id: string) {
  return prismadb.user.delete({ where: { id } });
}

export async function createUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  // hashing the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = prismadb.user.create({
    data: { name, email, password: { create: { passwordHash } } },
  });

  return user;
}

export async function verifyLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const userWithPassword = await prismadb.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.passwordHash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
