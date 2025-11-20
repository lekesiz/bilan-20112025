import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ClipboardList, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
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

  // Get statistics based on role
  let stats = {
    totalUsers: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    totalReports: 0
  }

  if (profile?.role === 'admin') {
    const [usersCount, assessmentsCount, completedCount, reportsCount] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('assessments').select('*', { count: 'exact', head: true }),
      supabase.from('assessments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('reports').select('*', { count: 'exact', head: true })
    ])

    stats = {
      totalUsers: usersCount.count || 0,
      totalAssessments: assessmentsCount.count || 0,
      completedAssessments: completedCount.count || 0,
      totalReports: reportsCount.count || 0
    }
  }

  // Get recent assessments
  const { data: recentAssessments } = await supabase
    .from('assessments')
    .select(`
      *,
      client:profiles!assessments_client_id_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'warning'
      case 'draft':
        return 'secondary'
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {profile?.full_name || 'Utilisateur'} !
        </h1>
        <p className="text-gray-600 mt-2">
          Voici un aperçu de votre tableau de bord
        </p>
      </div>

      {/* Stats Grid */}
      {profile?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Utilisateurs
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Total des utilisateurs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Évaluations
              </CardTitle>
              <ClipboardList className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalAssessments}</div>
              <p className="text-xs text-gray-500 mt-1">Total des évaluations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Terminées
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedAssessments}</div>
              <p className="text-xs text-gray-500 mt-1">Évaluations complétées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rapports
              </CardTitle>
              <FileText className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-gray-500 mt-1">Rapports générés</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/assessments/new">
            <Button>
              <ClipboardList className="h-4 w-4 mr-2" />
              Nouvelle évaluation
            </Button>
          </Link>
          {profile?.role === 'admin' && (
            <Link href="/dashboard/users">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gérer les utilisateurs
              </Button>
            </Link>
          )}
          <Link href="/dashboard/reports">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Voir les rapports
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Évaluations récentes</CardTitle>
          <CardDescription>Les dernières évaluations créées</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAssessments && recentAssessments.length > 0 ? (
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/dashboard/assessments/${assessment.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Client: {assessment.client?.full_name || assessment.client?.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Créé le {new Date(assessment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(assessment.status) as any}>
                      {getStatusLabel(assessment.status)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Aucune évaluation pour le moment</p>
              <Link href="/dashboard/assessments/new">
                <Button className="mt-4" size="sm">
                  Créer votre première évaluation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
