import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { Plus, ClipboardList, Search } from 'lucide-react'
import Link from 'next/link'

export default async function AssessmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get assessments based on role
  let query = supabase
    .from('assessments')
    .select(`
      *,
      client:profiles!assessments_client_id_fkey(full_name, email),
      consultant:profiles!assessments_consultant_id_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  // Filter by role
  if (profile?.role === 'client') {
    query = query.eq('client_id', user.id)
  } else if (profile?.role === 'consultant') {
    query = query.eq('consultant_id', user.id)
  }
  // Admin sees all

  const { data: assessments } = await query

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'warning'
      case 'draft':
        return 'secondary'
      case 'archived':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé'
      case 'in_progress':
        return 'En cours'
      case 'draft':
        return 'Brouillon'
      case 'archived':
        return 'Archivé'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Évaluations</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos bilans de compétences
          </p>
        </div>
        <Link href="/dashboard/assessments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assessments?.filter(a => a.status === 'in_progress').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assessments?.filter(a => a.status === 'completed').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {assessments?.filter(a => a.status === 'draft').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments List */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les évaluations</CardTitle>
          <CardDescription>
            {assessments?.length || 0} évaluation(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessments && assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/dashboard/assessments/${assessment.id}`}
                  className="block p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {assessment.title}
                        </h3>
                        <Badge variant={getStatusColor(assessment.status) as any}>
                          {getStatusLabel(assessment.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Client:</span>{' '}
                          {assessment.client?.full_name || assessment.client?.email}
                        </p>
                        {assessment.consultant && (
                          <p className="text-gray-600">
                            <span className="font-medium">Consultant:</span>{' '}
                            {assessment.consultant?.full_name || assessment.consultant?.email}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Créé le {formatDateTime(assessment.created_at)}
                        </p>
                        {assessment.completed_at && (
                          <p className="text-xs text-green-600">
                            Terminé le {formatDateTime(assessment.completed_at)}
                          </p>
                        )}
                      </div>

                      {/* Progress indicator */}
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Étape {assessment.current_step} / 6</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${(assessment.current_step / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune évaluation</h3>
              <p className="text-sm mb-4">Commencez par créer votre première évaluation</p>
              <Link href="/dashboard/assessments/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une évaluation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
