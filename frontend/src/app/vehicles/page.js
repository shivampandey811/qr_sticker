"use client"
import ProtectedRoute from '../../components/ProtectedRoute'
import Vehicles from '../../views/Vehicles'

export default function Page() {
  return (
    <ProtectedRoute>
      <Vehicles />
    </ProtectedRoute>
  )
}
