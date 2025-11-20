'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, ArrowRight, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { assessmentSections, getSectionByStep, type Question } from '@/lib/assessment-questions'

export default function AssessmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<any>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSection = getSectionByStep(currentStep)
  const totalSteps = assessmentSections.length

  useEffect(() => {
    loadAssessment()
  }, [assessmentId])

  const loadAssessment = async () => {
    try {
      const supabase = createClient()

      // Load assessment
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single()

      if (assessmentError) throw assessmentError

      setAssessment(assessmentData)
      setCurrentStep(assessmentData.current_step || 1)

      // Load responses
      const { data: responsesData } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('assessment_id', assessmentId)

      if (responsesData) {
        const responsesMap: Record<string, any> = {}
        responsesData.forEach((resp) => {
          responsesMap[resp.question_id] = resp.response
        })
        setResponses(responsesMap)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveResponses = async () => {
    if (!currentSection) return

    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()

      // Save each response
      for (const question of currentSection.questions) {
        if (responses[question.id] !== undefined) {
          await supabase
            .from('assessment_responses')
            .upsert({
              assessment_id: assessmentId,
              section: currentSection.id,
              question_id: question.id,
              response: responses[question.id]
            }, {
              onConflict: 'assessment_id,question_id'
            })
        }
      }

      // Update assessment progress
      await supabase
        .from('assessments')
        .update({
          current_step: currentStep,
          status: 'in_progress'
        })
        .eq('id', assessmentId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await saveResponses()
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = async () => {
    await saveResponses()
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = async () => {
    await saveResponses()

    try {
      const supabase = createClient()
      await supabase
        .from('assessments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', assessmentId)

      router.push(`/dashboard/assessments/${assessmentId}/analyze`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            placeholder={question.placeholder}
            required={question.required}
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
            placeholder={question.placeholder}
            required={question.required}
            rows={6}
          />
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => setResponses({ ...responses, [question.id]: e.target.value })}
                  required={question.required}
                  className="text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case 'scale':
        return (
          <div className="flex gap-2 flex-wrap">
            {question.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setResponses({ ...responses, [question.id]: option })}
                className={`px-4 py-2 border rounded-lg transition-all ${
                  value === option
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !assessment || !currentSection) {
    return (
      <div className="max-w-3xl mx-auto">
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/assessments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <p className="text-gray-600 mt-1">{currentSection.title}</p>
          </div>
        </div>
        <Badge variant={assessment.status === 'completed' ? 'success' : 'warning'}>
          {assessment.status === 'completed' ? 'Terminé' : 'En cours'}
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complété</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Form */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSection.title}</CardTitle>
          <CardDescription>{currentSection.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            {currentSection.questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderQuestion(question)}
              </div>
            ))}
          </form>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || saving}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Étape précédente
            </Button>

            <Button onClick={saveResponses} variant="ghost" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={saving}>
                Étape suivante
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={saving}>
                <Sparkles className="h-4 w-4 mr-2" />
                Terminer et analyser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
