'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Sparkles, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default function AnalyzePage() {
  const params = useParams()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<any>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAssessment()
  }, [assessmentId])

  const loadAssessment = async () => {
    try {
      const supabase = createClient()

      const { data, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single()

      if (assessmentError) throw assessmentError

      setAssessment(data)

      if (data.ai_analysis?.content) {
        setAnalysis(data.ai_analysis.content)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateAnalysis = async () => {
    setGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse')
      }

      setAnalysis(data.analysis)
      await loadAssessment() // Reload to get updated data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    // This will be implemented with PDF generation
    alert('La génération PDF sera disponible prochainement')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Évaluation non trouvée'}</p>
            <Link href="/dashboard/assessments">
              <Button className="mt-4" variant="outline">
                Retour aux évaluations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/assessments/${assessmentId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyse IA</h1>
            <p className="text-gray-600 mt-1">{assessment.title}</p>
          </div>
        </div>
        <Badge variant="default">
          <Sparkles className="h-3 w-3 mr-1" />
          Analyse intelligente
        </Badge>
      </div>

      {/* Generate or Display Analysis */}
      {!analysis ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Générer l'analyse IA</CardTitle>
            <CardDescription className="text-blue-800">
              Notre intelligence artificielle va analyser vos réponses et générer un rapport
              détaillé avec des recommandations personnalisées.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">L'analyse comprendra :</h3>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Synthèse complète de votre parcours professionnel</li>
                  <li>Identification détaillée de vos compétences</li>
                  <li>Analyse de vos points forts et axes d'amélioration</li>
                  <li>Recommandations personnalisées pour votre évolution</li>
                  <li>Plan d'action concret et échéancier</li>
                  <li>Opportunités de carrière adaptées à votre profil</li>
                </ul>
              </div>

              <Button
                onClick={generateAnalysis}
                disabled={generating}
                size="lg"
                className="w-full"
              >
                {generating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Génération en cours... (cela peut prendre 30-60 secondes)
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Générer l'analyse IA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Analyse générée le{' '}
                  {new Date(assessment.ai_analysis?.generated_at).toLocaleString('fr-FR')}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={generateAnalysis}
                    disabled={generating}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                    Régénérer
                  </Button>
                  <Button onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Votre Rapport d'Analyse</CardTitle>
              <CardDescription>
                Rapport généré par intelligence artificielle basé sur vos réponses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-green-800">
                <p>✓ Prenez le temps de lire attentivement votre analyse</p>
                <p>✓ Téléchargez le rapport en PDF pour le conserver</p>
                <p>✓ Partagez-le avec votre consultant ou conseiller</p>
                <p>✓ Commencez à mettre en œuvre le plan d'action recommandé</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Link href="/dashboard/reports">
                  <Button variant="outline">
                    Voir tous les rapports
                  </Button>
                </Link>
                <Link href="/dashboard/assessments/new">
                  <Button>
                    Nouvelle évaluation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
