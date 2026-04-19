'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Eye, Pencil, Trash2, XCircle, MessageSquareText, Loader2 } from 'lucide-react'
import { getUserReviewsAction, deleteReviewAction, updateReviewAction } from '@/actions/review-actions'
import { calculateAverageRating } from '@/lib/review-types'

interface Review {
  id: number
  collegeId?: number
  collegeName: string
  course: string
  rating: number
  title: string
  pros: string
  cons: string
  date: string
  summaryTitle?: string
  ratings?: Record<string, number>
  studentType?: string
  level?: string
  batchYear?: number
  isVerified?: boolean
  helpfulCount?: number
}

function getRatingDisplay(rating: number) {
  const displayRating = rating.toFixed(1)
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 border border-yellow-200 rounded text-sm font-semibold text-yellow-700">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      {displayRating}
    </span>
  )
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ratingFilter, setRatingFilter] = useState('all')
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [editForm, setEditForm] = useState({ title: '', rating: 0, pros: '', cons: '' })
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getUserReviewsAction(1, 20)
      if (result.success && result.data?.data?.reviews) {
        const mappedReviews: Review[] = result.data.data.reviews.map((r: any) => ({
          id: r.id,
          collegeId: r.collegeId,
          collegeName: r.collegeName || r.college || `College ${r.collegeId}`,
          course: r.course,
          rating: r.ratings ? calculateAverageRating(r.ratings) : r.rating || 0,
          title: r.summaryTitle || r.title || "",
          summaryTitle: r.summaryTitle,
          pros: r.pros,
          cons: r.cons,
          date: r.createdAt,
          ratings: r.ratings,
          studentType: r.studentType,
          level: r.level,
          batchYear: r.batchYear,
          isVerified: r.isVerified,
          helpfulCount: r.helpfulCount,
        }))
        setReviews(mappedReviews)
      } else {
        setError(result.error || 'Failed to load reviews')
        setReviews([])
      }
    } catch (err) {
      setError('Failed to load reviews')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const filteredReviews = ratingFilter === 'all' 
    ? reviews 
    : reviews.filter(r => Math.round(r.rating) === parseInt(ratingFilter))

  const handleView = (review: Review) => {
    setSelectedReview(review)
    setViewModalOpen(true)
  }

  const handleEdit = (review: Review) => {
    setSelectedReview(review)
    setEditForm({
      title: review.summaryTitle || review.title,
      rating: Math.round(review.rating * 2) / 2,
      pros: review.pros,
      cons: review.cons,
    })
    setEditModalOpen(true)
  }

  const handleDelete = (review: Review) => {
    setSelectedReview(review)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedReview) return
    setDeleting(true)
    try {
      const result = await deleteReviewAction(selectedReview.id)
      if (result.success) {
        setReviews(prev => prev.filter(r => r.id !== selectedReview.id))
        setDeleteModalOpen(false)
        setSelectedReview(null)
      } else {
        alert(result.error || 'Failed to delete review')
      }
    } catch (err) {
      alert('Failed to delete review')
    } finally {
      setDeleting(false)
    }
  }

  const saveEdit = async () => {
    if (!selectedReview) return
    setSaving(true)
    try {
      const result = await updateReviewAction(selectedReview.id, {
        summaryTitle: editForm.title,
        pros: editForm.pros,
        cons: editForm.cons,
      })
      if (result.success) {
        setReviews(prev => prev.map(r => 
          r.id === selectedReview.id 
            ? { ...r, summaryTitle: editForm.title, pros: editForm.pros, cons: editForm.cons, rating: editForm.rating }
            : r
        ))
        setEditModalOpen(false)
        setSelectedReview(null)
      } else {
        alert(result.error || 'Failed to update review')
      }
    } catch (err) {
      alert('Failed to update review')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Reviews</h1>
          <p className="text-gray-500 mt-1">Manage and track your college reviews and feedback.</p>
        </header>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Reviews</h1>
          <p className="text-gray-500 mt-1">Manage and track your college reviews and feedback.</p>
        </header>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
            <MessageSquareText className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading reviews</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchReviews}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Reviews</h1>
        <p className="text-gray-500 mt-1">Manage and track your college reviews and feedback.</p>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
          <div className="text-lg font-semibold text-gray-900">
            All Reviews ({filteredReviews.length})
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-gray-400 text-sm">Filter:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full md:w-40 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-shadow"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500">
              <MessageSquareText className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't reviewed any college yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Share your experience to help other students make informed decisions about their future.</p>
            <a
              href="/write-review"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Write a Review
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden group"
              >
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{review.collegeName}</h3>
                      {review.course && (
                        <p className="text-sm text-gray-500 mt-0.5">{review.course}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex text-yellow-400 text-sm">
                      {getRatingDisplay(review.rating)}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">• {formatDate(review.date)}</span>
                    {review.isVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Verified</span>
                    )}
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {review.pros && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-100">
                        + {review.pros.slice(0, 30)}{review.pros.length > 30 ? '...' : ''}
                      </span>
                    )}
                    {review.cons && (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium border border-red-100">
                        - {review.cons.slice(0, 30)}{review.cons.length > 30 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-50 bg-gray-50/50 p-4 flex justify-between items-center">
                  <button
                    onClick={() => handleView(review)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Read More
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 flex items-center justify-center transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {viewModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReview.collegeName}</h2>
                  {selectedReview.course && (
                    <p className="text-gray-500 font-medium">{selectedReview.course}</p>
                  )}
                  {selectedReview.studentType && (
                    <p className="text-sm text-gray-400">{selectedReview.studentType} • {selectedReview.level} • Batch {selectedReview.batchYear}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex text-yellow-400 text-2xl justify-end mb-1">
                    {getRatingDisplay(selectedReview.rating)}
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(selectedReview.date)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedReview.title}</h3>
                {selectedReview.ratings && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {Object.entries(selectedReview.ratings).map(([cat, val]) => (
                      <div key={cat} className="flex justify-between">
                        <span>{cat}</span>
                        <span className="font-medium">{val}/5</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
                    Pros
                  </h4>
                  <p className="text-sm text-gray-700">{selectedReview.pros}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                    Cons
                  </h4>
                  <p className="text-sm text-gray-700">{selectedReview.cons}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { setViewModalOpen(false); handleEdit(selectedReview); }}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { setViewModalOpen(false); handleDelete(selectedReview); }}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Review</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) || 1 })}
                      className="w-16 border border-gray-300 rounded-lg p-2 text-center font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <span className="text-gray-500">/ 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pros</label>
                  <textarea
                    value={editForm.pros}
                    onChange={(e) => setEditForm({ ...editForm, pros: e.target.value })}
                    rows={3}
                    placeholder="What are the best things about this college?"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cons</label>
                  <textarea
                    value={editForm.cons}
                    onChange={(e) => setEditForm({ ...editForm, cons: e.target.value })}
                    rows={3}
                    placeholder="What could be improved?"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-6 md:p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Review?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete this review for {selectedReview.collegeName}? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}