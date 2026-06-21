"use client"
import ProtectedRoute from '../../components/ProtectedRoute'
import Activate from '../../views/Activate'

export default function Page() {
  return (
    <ProtectedRoute>
      <Activate />
    </ProtectedRoute>
  )
}
