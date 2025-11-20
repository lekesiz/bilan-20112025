// Bilan de Compétences - Structured Questions

export interface Question {
  id: string
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale'
  question: string
  placeholder?: string
  options?: string[]
  required?: boolean
}

export interface Section {
  id: string
  title: string
  description: string
  questions: Question[]
}

export const assessmentSections: Section[] = [
  {
    id: 'parcours',
    title: 'Étape 1: Parcours Professionnel',
    description: 'Analysons votre parcours et vos expériences professionnelles',
    questions: [
      {
        id: 'current_situation',
        type: 'textarea',
        question: 'Décrivez votre situation professionnelle actuelle',
        placeholder: 'Poste, entreprise, secteur, responsabilités...',
        required: true
      },
      {
        id: 'work_experience',
        type: 'textarea',
        question: 'Résumez vos principales expériences professionnelles',
        placeholder: 'Listez vos postes précédents, missions principales, réalisations...',
        required: true
      },
      {
        id: 'education',
        type: 'textarea',
        question: 'Quel est votre parcours de formation ?',
        placeholder: 'Diplômes, formations, certifications...',
        required: true
      },
      {
        id: 'achievements',
        type: 'textarea',
        question: 'Quelles sont vos principales réalisations professionnelles ?',
        placeholder: 'Projets réussis, objectifs atteints, contributions significatives...'
      }
    ]
  },
  {
    id: 'competences',
    title: 'Étape 2: Identification des Compétences',
    description: 'Identifions vos compétences techniques et transversales',
    questions: [
      {
        id: 'technical_skills',
        type: 'textarea',
        question: 'Quelles sont vos compétences techniques principales ?',
        placeholder: 'Logiciels, outils, technologies, savoir-faire spécifiques...',
        required: true
      },
      {
        id: 'soft_skills',
        type: 'textarea',
        question: 'Quelles sont vos compétences comportementales (soft skills) ?',
        placeholder: 'Communication, leadership, organisation, créativité, travail d\'équipe...',
        required: true
      },
      {
        id: 'languages',
        type: 'text',
        question: 'Quelles langues maîtrisez-vous ?',
        placeholder: 'Ex: Français (natif), Anglais (courant), Espagnol (intermédiaire)...'
      },
      {
        id: 'strengths',
        type: 'textarea',
        question: 'Quels sont vos points forts professionnels ?',
        placeholder: 'Ce que vous faites particulièrement bien, vos talents naturels...',
        required: true
      },
      {
        id: 'areas_improvement',
        type: 'textarea',
        question: 'Quels domaines souhaitez-vous développer ?',
        placeholder: 'Compétences à améliorer ou à acquérir...',
        required: true
      }
    ]
  },
  {
    id: 'motivations',
    title: 'Étape 3: Motivations et Intérêts',
    description: 'Explorons ce qui vous motive dans votre travail',
    questions: [
      {
        id: 'what_motivates',
        type: 'textarea',
        question: 'Qu\'est-ce qui vous motive dans votre travail ?',
        placeholder: 'Challenges, reconnaissance, autonomie, impact, apprentissage...',
        required: true
      },
      {
        id: 'job_satisfaction',
        type: 'scale',
        question: 'Quel est votre niveau de satisfaction professionnelle actuel ?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true
      },
      {
        id: 'like_current_job',
        type: 'textarea',
        question: 'Qu\'aimez-vous dans votre travail actuel ?',
        placeholder: 'Aspects positifs de votre situation professionnelle...'
      },
      {
        id: 'dislike_current_job',
        type: 'textarea',
        question: 'Qu\'aimeriez-vous changer dans votre travail actuel ?',
        placeholder: 'Aspects que vous souhaiteriez améliorer ou modifier...'
      },
      {
        id: 'interests',
        type: 'textarea',
        question: 'Quels sont vos centres d\'intérêt professionnels ?',
        placeholder: 'Domaines, secteurs, types de missions qui vous attirent...',
        required: true
      }
    ]
  },
  {
    id: 'valeurs',
    title: 'Étape 4: Valeurs Professionnelles',
    description: 'Identifions vos valeurs et votre équilibre vie pro/perso',
    questions: [
      {
        id: 'core_values',
        type: 'textarea',
        question: 'Quelles sont vos valeurs professionnelles fondamentales ?',
        placeholder: 'Ex: intégrité, innovation, collaboration, impact social, excellence...',
        required: true
      },
      {
        id: 'work_life_balance',
        type: 'radio',
        question: 'Comment décririez-vous votre équilibre vie professionnelle/personnelle souhaité ?',
        options: [
          'Je privilégie ma carrière',
          'Je cherche un équilibre',
          'Je privilégie ma vie personnelle'
        ],
        required: true
      },
      {
        id: 'work_environment',
        type: 'textarea',
        question: 'Décrivez votre environnement de travail idéal',
        placeholder: 'Culture d\'entreprise, type d\'équipe, mode de travail (présentiel/remote)...',
        required: true
      },
      {
        id: 'deal_breakers',
        type: 'textarea',
        question: 'Qu\'est-ce qui serait rédhibitoire pour vous dans un emploi ?',
        placeholder: 'Aspects que vous ne souhaitez absolument pas retrouver...'
      }
    ]
  },
  {
    id: 'objectifs',
    title: 'Étape 5: Objectifs et Aspirations',
    description: 'Définissons vos objectifs professionnels',
    questions: [
      {
        id: 'short_term_goals',
        type: 'textarea',
        question: 'Quels sont vos objectifs à court terme (1-2 ans) ?',
        placeholder: 'Ce que vous souhaitez accomplir dans les prochaines années...',
        required: true
      },
      {
        id: 'long_term_goals',
        type: 'textarea',
        question: 'Quels sont vos objectifs à long terme (3-5 ans) ?',
        placeholder: 'Votre vision de carrière, où vous vous voyez...',
        required: true
      },
      {
        id: 'career_change',
        type: 'radio',
        question: 'Envisagez-vous une reconversion professionnelle ?',
        options: ['Oui', 'Non', 'Peut-être'],
        required: true
      },
      {
        id: 'target_positions',
        type: 'textarea',
        question: 'Quels types de postes vous intéressent ?',
        placeholder: 'Intitulés de postes, fonctions, secteurs visés...'
      },
      {
        id: 'obstacles',
        type: 'textarea',
        question: 'Quels obstacles identifiez-vous pour atteindre vos objectifs ?',
        placeholder: 'Contraintes, freins, manques...'
      }
    ]
  },
  {
    id: 'action',
    title: 'Étape 6: Plan d\'Action',
    description: 'Établissons votre plan d\'action pour la suite',
    questions: [
      {
        id: 'actions_needed',
        type: 'textarea',
        question: 'Quelles actions devez-vous entreprendre pour atteindre vos objectifs ?',
        placeholder: 'Formations, certifications, networking, changements...',
        required: true
      },
      {
        id: 'training_needs',
        type: 'textarea',
        question: 'Quelles formations ou certifications envisagez-vous ?',
        placeholder: 'Domaines à approfondir, compétences à acquérir...'
      },
      {
        id: 'timeline',
        type: 'textarea',
        question: 'Quel est votre calendrier prévisionnel ?',
        placeholder: 'Étapes et échéances que vous vous fixez...'
      },
      {
        id: 'support_needed',
        type: 'textarea',
        question: 'Quel accompagnement ou soutien vous serait utile ?',
        placeholder: 'Mentorat, coaching, réseau, ressources...'
      },
      {
        id: 'additional_notes',
        type: 'textarea',
        question: 'Remarques ou informations complémentaires',
        placeholder: 'Tout autre élément important à mentionner...'
      }
    ]
  }
]

export function getSectionById(sectionId: string): Section | undefined {
  return assessmentSections.find(s => s.id === sectionId)
}

export function getSectionByStep(step: number): Section | undefined {
  return assessmentSections[step - 1]
}
