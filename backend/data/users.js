import bcrypt from 'bcryptjs'
const users = [
  {
    name: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin', 10),
    isAdmin: true,
  },
  {
    name: 'user1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('user1', 10),
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('user2', 10),
  },
]

export default users