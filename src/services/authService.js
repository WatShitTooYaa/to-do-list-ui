export const mockUser = {
  name: 'Fate',
  email: 'fate@example.com',
  role: 'Product Designer',
}

export const login = ({ email }) =>
  Promise.resolve({
    ...mockUser,
    email,
  })

export const register = ({ name, email }) =>
  Promise.resolve({
    ...mockUser,
    name,
    email,
  })
