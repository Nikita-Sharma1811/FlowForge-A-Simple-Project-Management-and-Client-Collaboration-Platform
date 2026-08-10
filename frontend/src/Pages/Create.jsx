import React, { useState } from 'react'
import { API_ENDPOINTS } from '../consants/ApiContants'
import { useAuth } from '../context/AuthContext.jsx'

export default function Create() {
	const { authToken } = useAuth()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [result, setResult] = useState(null)

	const handleSubmit = async (e) => {
		e?.preventDefault()
		setIsLoading(true)
		setError('')
		setResult(null)
		try {
			if (!name || !description) {
				setError('Please provide both name and description')
				setIsLoading(false)
				return
			}
			const response = await fetch('http://10.51.0.89:3001/organisation/createOrganization', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: '*/*',
					...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
				},
				body: JSON.stringify({ name, description })
			})
			const data = await response.json().catch(() => ({}))
			if (!response.ok) {
				throw new Error(data?.message || `Failed with status ${response.status}`)
			}
			setResult(data)
			setName('')
			setDescription('')
		} catch (err) {
			setError(err.message || 'Failed to create organization')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Create Organization</h1>
			<form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Organization name"
						className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Brief description"
						rows={4}
						className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
				>
					{isLoading ? 'Creating...' : 'Create'}
				</button>
			</form>

			{error && (
				<div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
			)}

			{result && (
				<div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
					<p className="text-green-700 font-semibold">{result.message || 'Organization created successfully'}</p>
				</div>
			)}
		</div>
	)
}
