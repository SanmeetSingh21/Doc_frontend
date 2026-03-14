import { useState, useRef, useEffect } from 'react'
import { Bell, Search, ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/index'
import styles from './Topbar.module.css'

export default function Topbar({ collapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR'

  return (
    <header
      className={styles.topbar}
      style={{ left: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
    >
      {/* Search */}
      <div className={styles.search}>
        <Search size={15} className={styles.searchIcon} />
        <input className={styles.searchInput} placeholder="Search patients, records..." type="search" />
      </div>

      {/* Right */}
      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={1.75} />
          <span className={styles.badge}>3</span>
        </button>

        {/* Profile dropdown */}
        <div className={styles.profileWrap} ref={dropRef}>
          <button className={styles.profile} onClick={() => setDropOpen(o => !o)}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{user?.name || 'Doctor'}</span>
              <span className={styles.profileRole}>{user?.roleLabel || 'Staff'}</span>
            </div>
            <ChevronDown size={14} className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ''}`} />
          </button>

          {dropOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropUser}>
                <div className={styles.dropAvatar}>{initials}</div>
                <div>
                  <div className={styles.dropName}>{user?.name}</div>
                  <div className={styles.dropEmail}>{user?.email}</div>
                </div>
              </div>
              <hr className={styles.dropDivider}/>
              <button className={styles.dropItem}>
                <User size={14}/> My Profile
              </button>
              <button className={`${styles.dropItem} ${styles.dropLogout}`} onClick={handleLogout}>
                <LogOut size={14}/> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}