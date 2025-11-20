import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get assessment and responses
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: 'Évaluation non trouvée' }, { status: 404 })
    }

    // Get all responses
    const { data: responses } = await supabase
      .from('assessment_responses')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: true })

    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: 'Aucune réponse trouvée' }, { status: 400 })
    }

    // Format responses for AI analysis
    const formattedResponses = responses.map(r => ({
      section: r.section,
      question: r.question_id,
      response: r.response
    }))

    // Create AI prompt
    const systemPrompt = `Tu es un expert en bilans de compétences et en conseil en évolution professionnelle.
Ton rôle est d'analyser les réponses d'un candidat à un bilan de compétences et de fournir une analyse approfondie, structurée et constructive.

L'analyse doit être en français et contenir les sections suivantes :

1. **Synthèse du parcours** : Résumé du profil professionnel du candidat

2. **Compétences identifiées** : Liste des compétences techniques et transversales

3. **Points forts** : Atouts majeurs du candidat

4. **Axes d'amélioration** : Domaines à développer

5. **Motivations et valeurs** : Ce qui anime le candidat

6. **Recommandations** : Cette section doit être particulièrement détaillée et structurée avec les sous-sections suivantes :
   - **Formations et certifications** : Formations spécifiques, certifications professionnelles, diplômes recommandés (avec noms précis d'organismes quand pertinent)
   - **Développement de compétences** : Compétences prioritaires à développer avec des méthodes concrètes (cours en ligne, livres, projets pratiques, workshops)
   - **Réseautage professionnel** : Stratégies de networking (événements à cibler, communautés professionnelles, associations, LinkedIn)
   - **Ressources et outils** : Outils pratiques, plateformes, applications, sites web, livres de référence adaptés au profil
   - **Mentorat et accompagnement** : Type de mentor ou coach recommandé, programmes d'accompagnement pertinents

7. **Plan d'action suggéré** : Étapes recommandées avec échéancier précis (court terme: 0-3 mois, moyen terme: 3-12 mois, long terme: 1-3 ans)

8. **Opportunités de carrière** : Métiers et secteurs adaptés au profil avec exemples concrets de postes

Sois bienveillant, constructif et professionnel. Donne des conseils concrets et actionnables avec des exemples spécifiques quand c'est possible.`

    const userPrompt = `Voici les réponses du candidat au bilan de compétences :

${JSON.stringify(formattedResponses, null, 2)}

Merci de fournir une analyse complète et structurée.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    const analysis = completion.choices[0].message.content

    // Save analysis to assessment
    await supabase
      .from('assessments')
      .update({
        ai_analysis: {
          content: analysis,
          generated_at: new Date().toISOString(),
          model: 'gpt-4o'
        }
      })
      .eq('id', assessmentId)

    // Create report record
    await supabase
      .from('reports')
      .insert({
        assessment_id: assessmentId,
        generated_by: user.id,
        content: {
          analysis,
          responses: formattedResponses
        }
      })

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'generate_analysis',
        entity_type: 'assessment',
        entity_id: assessmentId
      })

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'analyse' },
      { status: 500 }
    )
  }
}
