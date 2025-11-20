import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ClipboardList,
  TrendingUp,
  Shield,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <Badge className="mx-auto" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Plateforme d'Analyse IA
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Bilan de Compétences
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Nouvelle Génération
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plateforme intelligente pour réaliser des bilans de compétences professionnels,
            avec analyse par intelligence artificielle et rapports personnalisés.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Se connecter
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Analyse IA avancée
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Rapports détaillés
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              100% sécurisé
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une solution complète et moderne pour gérer vos bilans de compétences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Analyse IA Avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Notre intelligence artificielle analyse vos compétences et génère des
                recommandations personnalisées pour votre évolution professionnelle.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Questionnaire Structuré</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Un parcours d'évaluation complet en 6 étapes pour identifier vos
                compétences, motivations et objectifs professionnels.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Rapports Détaillés</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Recevez des rapports complets avec synthèse, analyse, recommandations
                et plan d'action personnalisé exportables en PDF.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Suivi de Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Suivez l'évolution de vos évaluations avec un tableau de bord intuitif
                et des statistiques détaillées.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Sécurité Maximale</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Vos données sont protégées avec authentification sécurisée, chiffrement
                et conformité RGPD garantie.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Multi-utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Système de rôles pour clients, consultants et administrateurs.
                Parfait pour les cabinets de conseil et les RH.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Un processus simple et efficace en 4 étapes
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: '1',
                title: 'Créez votre compte',
                description: 'Inscrivez-vous en quelques secondes et accédez à votre tableau de bord personnalisé.'
              },
              {
                step: '2',
                title: 'Complétez l\'évaluation',
                description: 'Répondez aux questions sur votre parcours, compétences, motivations et objectifs.'
              },
              {
                step: '3',
                title: 'Recevez votre analyse',
                description: 'L\'IA analyse vos réponses et génère un rapport détaillé en quelques instants.'
              },
              {
                step: '4',
                title: 'Passez à l\'action',
                description: 'Suivez les recommandations et le plan d\'action pour atteindre vos objectifs.'
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Rejoignez des centaines de professionnels qui ont déjà découvert leurs
              compétences cachées et trouvé leur voie avec notre plateforme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Démarrer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Bilan de Compétences IA</h3>
          <p className="text-gray-400 mb-6">
            La plateforme de nouvelle génération pour votre évolution professionnelle
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Inscription
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © {new Date().getFullYear()} Bilan Compétences IA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
