'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewAssessmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      // Create assessment
      const { data: assessment, error: insertError } = await supabase
        .from('assessments')
        .insert({
          client_id: user.id,
          title: formData.title,
          status: 'draft',
          current_step: 1,
          data: {
            description: formData.description
          }
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Redirect to assessment detail page
      router.push(`/dashboard/assessments/${assessment.id}`)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle évaluation</h1>
          <p className="text-gray-600 mt-1">
            Créez un nouveau bilan de compétences
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
          <CardDescription>
            Commencez par définir le titre et l'objectif de votre bilan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">
                Titre de l'évaluation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex: Bilan de compétences - Reconversion professionnelle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Donnez un titre significatif qui décrit l'objectif de cette évaluation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le contexte, les objectifs et les attentes de ce bilan..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                rows={6}
              />
              <p className="text-xs text-gray-500">
                Ajoutez des notes ou des informations contextuelles utiles
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !formData.title}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Création en cours...
                  </>
                ) : (
                  'Créer l\'évaluation'
                )}
              </Button>
              <Link href="/dashboard/assessments">
                <Button type="button" variant="outline" disabled={loading}>
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">À propos du bilan de compétences</h3>
          <p className="text-sm text-blue-800">
            Le bilan de compétences vous permet d'analyser vos compétences professionnelles et
            personnelles, vos aptitudes et vos motivations. Il comprend plusieurs étapes :
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-800 mt-3 space-y-1">
            <li>Analyse de votre parcours professionnel</li>
            <li>Identification de vos compétences</li>
            <li>Évaluation de vos motivations</li>
            <li>Exploration de vos valeurs professionnelles</li>
            <li>Définition de vos objectifs</li>
            <li>Plan d'action et synthèse</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
