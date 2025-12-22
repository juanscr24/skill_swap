'use client'

import { useState } from 'react'
import { useUserProfile, useCreateReview } from '@/hooks/useUserProfile'
import { useSession } from 'next-auth/react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { FiMapPin, FiLoader, FiStar } from 'react-icons/fi'

interface UserProfileViewProps {
  userId: string
}

export const UserProfileView = ({ userId }: UserProfileViewProps) => {
  const { data: session } = useSession()
  const { profile, isLoading, error, refetch } = useUserProfile(userId)
  const { createReview, isSubmitting } = useCreateReview()
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Verificar si el usuario actual ya hizo una review
  const hasReviewed = profile?.reviews.some(
    (review) => review.users_reviews_author_idTousers?.id === session?.user?.id
  )

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError(null)
    setSuccessMessage(null)

    if (rating === 0) {
      setReviewError('Por favor selecciona una calificación')
      return
    }

    if (!comment.trim()) {
      setReviewError('Por favor escribe un comentario')
      return
    }

    try {
      await createReview({
        targetId: userId,
        rating,
        comment: comment.trim(),
      })

      setSuccessMessage('¡Review enviada exitosamente!')
      setShowReviewForm(false)
      setRating(0)
      setComment('')
      
      // Refrescar el perfil
      setTimeout(() => {
        refetch()
        setSuccessMessage(null)
      }, 2000)
    } catch (err: any) {
      setReviewError(err.message || 'Error al enviar la review')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 max-md:p-6 max-sm:p-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="p-8 max-md:p-6 max-sm:p-4 max-w-5xl mx-auto">
        <Card className="p-6 text-center">
          <p className="text-red-500">{error || 'Error al cargar el perfil'}</p>
        </Card>
      </div>
    )
  }

  const isOwnProfile = session?.user?.id === userId

  return (
    <div className="p-8 max-md:p-6 max-sm:p-4 max-w-5xl mx-auto">
      {/* Header */}
      <Card className="mb-6 max-sm:mb-4">
        <div className="flex flex-col md:flex-row gap-6 max-md:gap-4">
          <Avatar 
            src={profile.image || ''} 
            alt={profile.name || 'User'} 
            size="xl" 
            className="mx-auto md:mx-0"
          />
          
          <div className="flex-1">
            <div className="mb-2">
              <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1)">
                {profile.name || 'Sin nombre'}
              </h1>
              <div className="flex items-center gap-2 text-(--text-2) mt-1">
                <FiMapPin className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                <span className="max-sm:text-sm">{profile.city || 'Sin ubicación'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 max-sm:gap-3 my-4 max-sm:my-3 flex-wrap">
              <div className="flex items-center gap-2 max-sm:gap-1">
                <Rating value={profile.averageRating} readonly size="sm" />
                <span className="font-semibold text-(--text-1) max-sm:text-sm">
                  {profile.averageRating.toFixed(1)}
                </span>
                <span className="text-(--text-2) text-sm max-sm:text-xs">
                  ({profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
            
            <p className="text-(--text-2) max-sm:text-sm">
              {profile.bio || 'Sin descripción'}
            </p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="mb-6 max-sm:mb-4">
        <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1) mb-4 max-sm:mb-3">
          Habilidades
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.length > 0 ? (
            profile.skills.map((skill) => (
              <Badge key={skill.id} variant="info">
                {skill.name} {skill.level ? `- ${skill.level}` : ''}
              </Badge>
            ))
          ) : (
            <p className="text-(--text-2) text-sm">No tiene skills agregadas</p>
          )}
        </div>
      </Card>

      {/* Wanted Skills */}
      {profile.wanted_skills.length > 0 && (
        <Card className="mb-6 max-sm:mb-4">
          <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1) mb-4 max-sm:mb-3">
            Habilidades que quiere aprender
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.wanted_skills.map((skill) => (
              <Badge key={skill.id} variant="warning">
                {skill.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews Section */}
      <Card className="mb-6 max-sm:mb-4">
        <div className="flex items-center justify-between mb-4 max-sm:mb-3">
          <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1)">
            Reviews ({profile.totalReviews})
          </h2>
          
          {!isOwnProfile && !hasReviewed && !showReviewForm && (
            <Button 
              primary 
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 max-sm:text-sm"
            >
              <FiStar className="w-4 h-4" />
              Dejar review
            </Button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && !isOwnProfile && !hasReviewed && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-(--bg-1) rounded-lg">
            <h3 className="text-lg font-semibold text-(--text-1) mb-3">Escribe tu review</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-(--text-1) mb-2">
                Calificación
              </label>
              <Rating 
                value={rating} 
                onChange={setRating}
                size="lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-(--text-1) mb-2">
                Comentario
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia..."
                className="w-full p-3 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:ring-2 focus:ring-(--button-1) transition-all resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-(--text-2) mt-1">
                {comment.length}/500 caracteres
              </p>
            </div>

            {reviewError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {reviewError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                primary
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar review'}
              </Button>
              <Button
                type="button"
                secondary
                onClick={() => {
                  setShowReviewForm(false)
                  setRating(0)
                  setComment('')
                  setReviewError(null)
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Already Reviewed Message */}
        {hasReviewed && !isOwnProfile && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
            Ya has dejado una review para este usuario
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {profile.reviews.length > 0 ? (
            profile.reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-(--bg-1) rounded-lg border border-(--border-1)"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar
                    src={review.users_reviews_author_idTousers?.image || ''}
                    alt={review.users_reviews_author_idTousers?.name || 'User'}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-(--text-1) text-sm">
                        {review.users_reviews_author_idTousers?.name || 'Usuario anónimo'}
                      </h4>
                      <span className="text-xs text-(--text-2)">
                        {new Date(review.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Rating value={review.rating} readonly size="sm" />
                  </div>
                </div>
                {review.comment && (
                  <p className="text-(--text-2) text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-(--text-2) text-sm">
                {isOwnProfile
                  ? 'Aún no tienes reviews'
                  : 'Este usuario aún no tiene reviews'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
