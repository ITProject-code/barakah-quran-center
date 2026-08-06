import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaUserPlus, FaEdit, FaTrash, FaEye, FaUser, 
  FaChalkboardTeacher, FaSearch, FaUserShield,
  FaChevronLeft, FaChevronRight, FaPhone, FaEnvelope,
  FaCopy, FaCheck
} from 'react-icons/fa'

const Users = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [newUserCredentials, setNewUserCredentials] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [copied, setCopied] = useState(false)

  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'teacher'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data.users || [])
    } catch (error) {
      toast.error(t('Failed to fetch users', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchUsers()
      return
    }
    try {
      setLoading(true)
      const response = await api.get('/users')
      const allUsers = response.data.users || []
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setUsers(filtered)
    } catch (error) {
      toast.error(t('Search failed', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role
        })
        toast.success(t('User updated successfully', lang))
        setShowModal(false)
        setEditingUser(null)
        setFormData({ name: '', phone: '', role: 'teacher' })
        fetchUsers()
      } else {
        const response = await api.post('/auth/register', {
          name: formData.name,
          phone: formData.phone,
          role: formData.role
        })
        
        setNewUserCredentials({
          name: response.data.user.name,
          email: response.data.user.email,
          defaultPassword: response.data.user.defaultPassword,
          role: response.data.user.role
        })
        setShowCredentialsModal(true)
        setShowModal(false)
        setFormData({ name: '', phone: '', role: 'teacher' })
        fetchUsers()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('Operation failed', lang))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}`)
      toast.success(t('User deleted successfully', lang))
      setShowDeleteModal(false)
      fetchUsers()
    } catch (error) {
      toast.error(t('Failed to delete user', lang))
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ name: '', phone: '', role: 'teacher' })
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, phone: user.phone || '', role: user.role })
    setShowModal(true)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(t('Copied to clipboard!', lang))
    setTimeout(() => setCopied(false), 3000)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('User Management', lang)} 
      subtitle={t('Manage all users (Admin & Teachers)', lang)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">{t('Users', lang)}</h2>
          <p className="text-sm text-muted">{users.length} {t('total users', lang)}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <FaUserPlus />
          {t('Add User', lang)}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t('Search users by name, email, role, or phone...', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button onClick={handleSearch} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            {t('Search', lang)}
          </button>
          <button onClick={() => { setSearchTerm(''); fetchUsers() }} className="px-6 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">
            {t('Clear', lang)}
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading users...', lang)}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaUser className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Users Found', lang)}</h3>
          <p className="text-muted mt-2">{t('Start by creating your first user', lang)}</p>
          <button onClick={openCreateModal} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            {t('Add User', lang)}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-beige overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-beige">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('User', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Email', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Role', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Phone', lang)}</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase">{t('Actions', lang)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-beige/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-primary/20 text-primary'
                          }`}>
                            {user.role === 'admin' ? <FaUserShield /> : <FaChalkboardTeacher />}
                          </div>
                          <span className="font-medium text-text">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-primary/20 text-primary'
                        }`}>
                          {isArabic ? (user.role === 'admin' ? 'مدير' : 'معلمة') : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">{user.phone || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              if (user.role === 'teacher') {
                                navigate(`/admin/teachers/${user.id}`)
                              } else {
                                toast.info(isArabic ? 'قريباً' : 'Coming soon')
                              }
                            }}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title={t('View Profile', lang)}
                          >
                            <FaEye />
                          </button>
                          <button onClick={() => openEditModal(user)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors" title={t('Edit', lang)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('Delete', lang)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted">{t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, users.length)} {t('of', lang)} {users.length}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronLeft /></button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronRight /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">
              {editingUser ? t('Edit User', lang) : t('Add New User', lang)}
            </h3>
            {!editingUser && (
              <p className="text-sm text-muted mb-4">
                {isArabic ? 'سيتم إنشاء البريد الإلكتروني وكلمة المرور تلقائياً' : 'Email and password will be auto-generated.'}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">{t('Full Name', lang)} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder={isArabic ? 'أدخل الاسم الكامل' : 'Enter full name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">{t('Phone', lang)}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder={isArabic ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">{t('Role', lang)} *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="teacher">{isArabic ? 'معلمة' : 'Teacher'}</option>
                  <option value="admin">{isArabic ? 'مدير' : 'Admin'}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  {editingUser ? t('Update', lang) : t('Create User', lang)}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-text py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  {t('Cancel', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show Generated Credentials Modal */}
      {showCredentialsModal && newUserCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FaUserPlus className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-dark">{t('User Created Successfully!', lang)}</h3>
              <p className="text-muted text-sm mt-2">{isArabic ? 'شارك هذه البيانات مع المستخدم' : 'Share these credentials with the user'}</p>
            </div>

            <div className="bg-beige rounded-xl p-4 space-y-3">
              <div><label className="text-xs text-muted">{t('Name', lang)}</label><p className="font-medium text-text">{newUserCredentials.name}</p></div>
              <div><label className="text-xs text-muted">{t('Role', lang)}</label><p className="font-medium text-text capitalize">{newUserCredentials.role}</p></div>
              <div>
                <label className="text-xs text-muted">{t('Email', lang)}</label>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-text break-all">{newUserCredentials.email}</p>
                  <button onClick={() => copyToClipboard(newUserCredentials.email)} className="text-primary hover:text-gold transition-colors"><FaCopy /></button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">{t('Default Password', lang)}</label>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-bold text-primary-dark">{newUserCredentials.defaultPassword}</p>
                  <button onClick={() => copyToClipboard(newUserCredentials.defaultPassword)} className="text-primary hover:text-gold transition-colors"><FaCopy /></button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700">⚠️ {isArabic ? 'يجب على المستخدم تغيير كلمة المرور عند تسجيل الدخول لأول مرة' : 'User must change password on first login'}</p>
            </div>

            <button onClick={() => { setShowCredentialsModal(false); setNewUserCredentials(null) }} className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
              {t('Done', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-2xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete User', lang)}</h3>
              <p className="text-muted">{t('Are you sure you want to delete', lang)} <strong>{selectedUser.name}</strong>?<br />{t('This action cannot be undone', lang)}</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">{t('Cancel', lang)}</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">{t('Delete', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Users