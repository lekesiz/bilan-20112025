import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { FileText, Download, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function ReportsPage() {
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

  // Get reports with assessment details
  let query = supabase
    .from('reports')
    .select(`
      *,
      assessment:assessments(
        id,
        title,
        status,
        client:profiles!assessments_client_id_fkey(full_name, email)
      ),
      generated_by_profile:profiles!reports_generated_by_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  // Filter based on role
  if (profile?.role === 'client') {
    // Get reports for assessments where user is the client
    const { data: assessments } = await supabase
      .from('assessments')
      .select('id')
      .eq('client_id', user.id)

    if (assessments) {
      const assessmentIds = assessments.map(a => a.id)
      query = query.in('assessment_id', assessmentIds)
    }
  }
  // Admin and consultant see all reports

  const { data: reports } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
        <p className="text-gray-600 mt-2">
          Consultez tous les rapports d'analyse générés
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Rapports générés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reports?.filter(r => {
                const createdDate = new Date(r.created_at)
                const now = new Date()
                return createdDate.getMonth() === now.getMonth() &&
                       createdDate.getFullYear() === now.getFullYear()
              }).length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Générés ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports?.filter(r => {
                const createdDate = new Date(r.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return createdDate > weekAgo
              }).length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les rapports</CardTitle>
          <CardDescription>
            {reports?.length || 0} rapport(s) disponible(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {report.assessment?.title}
                        </h3>
                        <Badge variant="default">v{report.version}</Badge>
                      </div>

                      <div className="space-y-1 text-sm">
                        {report.assessment?.client && (
                          <p className="text-gray-600">
                            <span className="font-medium">Client:</span>{' '}
                            {report.assessment.client.full_name || report.assessment.client.email}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <span className="font-medium">Généré par:</span>{' '}
                          {report.generated_by_profile?.full_name || report.generated_by_profile?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(report.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard/assessments/${report.assessment_id}/analyze`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      {report.pdf_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={report.pdf_url} download>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun rapport</h3>
              <p className="text-sm mb-4">
                Les rapports apparaîtront ici une fois les évaluations analysées
              </p>
              <Link href="/dashboard/assessments">
                <Button>
                  Voir les évaluations
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
