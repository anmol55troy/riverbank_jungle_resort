'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export interface FormActionsProps {
  isSubmitting?: boolean
  saveLabel?: string
  cancelHref?: string
  onDelete?: () => Promise<void>
  deleteMessage?: string
}

export function FormActions({
  isSubmitting = false,
  saveLabel = 'Save Changes',
  cancelHref,
  onDelete,
  deleteMessage = 'Are you sure you want to delete this record? This action cannot be undone.',
}: FormActionsProps) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="flex items-center justify-between pt-6 border-t border-espresso/10 mt-8">
      <div>
        {onDelete && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            disabled={isSubmitting}
          >
            Delete Record
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {cancelHref && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push(cancelHref)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
          {saveLabel}
        </Button>
      </div>

      {onDelete && (
        <ConfirmDialog
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          message={deleteMessage}
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}
