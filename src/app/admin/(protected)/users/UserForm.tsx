'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/app/admin/_components/forms/FormField'
import { TextInput } from '@/app/admin/_components/forms/Inputs'
import { FormActions } from '@/app/admin/_components/forms/FormActions'
import { useToast } from '@/app/admin/_components/ui/Toast'
import { saveAdminUser, deleteAdminUser } from '@/lib/services/users'
import type { User } from '@/lib/types'

export interface UserFormProps {
  user?: User | null
  currentUserId?: string
}

export function UserForm({ user, currentUserId }: UserFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isSelf = user?.id === currentUserId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await saveAdminUser(user?.id || null, formData)
      if (res.success) {
        addToast(user ? 'User updated.' : 'User created.', 'success')
        router.push('/admin/users')
        router.refresh()
      } else {
        setError(res.error || 'Failed to save user.')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "An unknown error occurred") || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!user?.id) return
    const res = await deleteAdminUser(user.id)
    if (res.success) {
      addToast('User deleted.', 'success')
      router.push('/admin/users')
      router.refresh()
    } else {
      addToast(res.error || 'Failed to delete user.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-espresso/10 p-6 sm:p-8 space-y-6 shadow-xs max-w-xl">
      {error && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">{error}</div>}

      <FormField label="Full Name">
        <TextInput name="name" defaultValue={user?.name || ''} placeholder="e.g. Resort Manager" />
      </FormField>

      <FormField label="Email Address" required>
        <TextInput
          name="email"
          type="email"
          defaultValue={user?.email || ''}
          required
          placeholder="admin@riverbankjungleresort.com"
        />
      </FormField>

      <FormField
        label={user ? 'Change Password (leave blank to keep current)' : 'Password'}
        required={!user}
        description="Minimum 8 characters. Will be encrypted using secure scrypt derivation."
      >
        <TextInput
          name="password"
          type="password"
          required={!user}
          minLength={8}
          placeholder={user ? '••••••••' : 'Enter a secure password'}
        />
      </FormField>

      <FormActions
        isSubmitting={isSubmitting}
        cancelHref="/admin/users"
        saveLabel={user ? 'Update User' : 'Create User'}
        onDelete={user && !isSelf ? handleDelete : undefined}
        deleteMessage={`Are you sure you want to delete administrator "${user?.email}"?`}
      />
    </form>
  )
}
