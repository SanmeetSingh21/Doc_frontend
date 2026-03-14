import { useAuth } from '@/store/index'

export function useCurrentUser() {
  const { user } = useAuth()
  return user
}

export function useHasRole(...roles) {
  const { user } = useAuth()
  return user ? roles.includes(user.role) : false
}