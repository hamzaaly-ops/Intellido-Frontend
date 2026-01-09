import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import DocumentUpload from '../components/DocumentUpload'
import ChatInterface from '../components/ChatInterface'
import axios from 'axios'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true)
      setError('')
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/documents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setDocuments(response.data || [])
    } catch (err) {
      setError('Failed to load documents')
    } finally {
      setLoadingDocs(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUploaded = (newDocs) => {
    setDocuments((prev) => [...newDocs, ...prev])
  }

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8000/documents/${docId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
    } catch (err) {
      alert('Failed to delete document. Please try again.')
    }
  }

  const handleResetAll = async () => {
    if (
      !window.confirm(
        'This will remove all your documents and their knowledge from the bot. Continue?'
      )
    )
      return

    try {
      const token = localStorage.getItem('token')
      await axios.delete('http://localhost:8000/documents/reset/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setDocuments([])
    } catch (err) {
      alert('Failed to reset knowledge base. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* <Logo className="h-8" /> */}
              <span className="text-xl font-bold text-gray-900">IntelliDo</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex h-[640px]">
          {/* Left panel: documents & upload */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Documents</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload, view, and delete documents. Deleted documents will be removed from search.
                  </p>
                </div>
                <button
                  onClick={handleResetAll}
                  className="text-xs px-3 py-1 rounded-full border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingDocs ? (
                <p className="text-sm text-gray-500">Loading documents...</p>
              ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500">No documents uploaded yet.</p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 mr-2">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {doc.filename}
                      </p>
                      {doc.created_at && (
                        <p className="text-xs text-gray-500">
                          {new Date(doc.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded border border-red-100 hover:border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 p-4">
              <DocumentUpload onUploaded={handleUploaded} />
            </div>
          </div>

          {/* Right panel: chat */}
          <div className="flex-1 p-6">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  )
}
