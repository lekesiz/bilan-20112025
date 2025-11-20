import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { Mail, Phone, Building2 } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'consultant':
        return 'default'
      case 'client':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur'
      case 'consultant':
        return 'Consultant'
      case 'client':
        return 'Client'
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-gray-600 mt-2">
          Gérez tous les utilisateurs de la plateforme
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les utilisateurs ({users?.length || 0})</CardTitle>
          <CardDescription>
            Liste complète des utilisateurs inscrits sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((userProfile) => (
                <div
                  key={userProfile.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                          {userProfile.full_name?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {userProfile.full_name || 'Sans nom'}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3.5 w-3.5" />
                              {userProfile.email}
                            </div>
                            {userProfile.phone && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="h-3.5 w-3.5" />
                                {userProfile.phone}
                              </div>
                            )}
                          </div>
                          {userProfile.organization && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {userProfile.organization}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Inscrit le {formatDateTime(userProfile.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(userProfile.role) as any}>
                      {getRoleLabel(userProfile.role)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics by Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Administrateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {users?.filter(u => u.role === 'admin').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {users?.filter(u => u.role === 'consultant').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {users?.filter(u => u.role === 'client').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
