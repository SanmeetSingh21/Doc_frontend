import { createContext, useContext, useState } from 'react'
const AuthContext = createContext(null)

export const ROLE_PERMISSIONS = {
  doctor:    ['dashboard','patients','opd','pregnancy','ultrasound','reconstructive','fertility','billing','calculators','consent','engagement'],
  reception: ['dashboard','patients','opd','pregnancy','ultrasound','engagement'],
  billing:   ['dashboard','billing'],
  lab:       ['dashboard','ultrasound'],
  admin:     ['dashboard','patients','opd','pregnancy','ultrasound','reconstructive','fertility','billing','calculators','consent','engagement'],
}

export function canAccess(role, module) {
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gynaecare_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData) => {
    localStorage.setItem('gynaecare_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('gynaecare_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)