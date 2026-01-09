import { useState } from 'react'
import axios from 'axios'

export default function DocumentUpload({ onUploaded }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
    setMessage({ type: '', text: '' })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one file' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')

      const uploadedDocs = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(
          'http://localhost:8000/documents/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        if (response.data?.document) {
          uploadedDocs.push(response.data.document)
        }
      }

      if (uploadedDocs.length > 0) {
        setMessage({
          type: 'success',
          text: `Successfully uploaded ${uploadedDocs.length} file(s)!`,
        })
        if (onUploaded) {
          onUploaded(uploadedDocs)
        }
        setFiles([])
        const fileInput = document.getElementById('file-input')
        if (fileInput) fileInput.value = ''
      } else {
        setMessage({
          type: 'warning',
          text: 'No files were uploaded. Please try again.',
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.detail ||
          'Upload failed. Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600">
          Upload PDF, DOCX, or text files to build your knowledge base
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition">
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.doc"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-lg font-medium text-gray-700 mb-2">
            Click to upload or drag and drop
          </span>
          <span className="text-sm text-gray-500">
            PDF, DOCX, TXT files (max 10MB each)
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Files:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {message.text && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : message.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : `Upload ${files.length > 0 ? `${files.length} ` : ''}File(s)`}
      </button>
    </div>
  )
}
