import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Recycle, Leaf, Droplets, Car, ShoppingBag, Home, Utensils, Trophy, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PersonalStats {
  plasticReduction: number;
  waterSaving: number;
  energySaving: number;
  wasteReduction: number;
  ecoScore: number;
  co2Saved: number; // kg per month
  moneySaved: number; // euros per month
}

interface DailyAction {
  id: string;
  title: string;
  description: string;
  category: 'plastic' | 'water' | 'energy' | 'waste' | 'transport';
  impact: {
    plasticReduction?: number;
    waterSaving?: number;
    energySaving?: number;
    wasteReduction?: number;
    co2Saved: number;
    moneySaved: number;
    ecoScore: number;
  };
  completed: boolean;
  streak: number;
  lastCompleted?: string; // ISO date string
}

const PersonalEcoTracker = () => {
  const [personalStats, setPersonalStats] = useLocalStorage<PersonalStats>('eco-personal-stats', {
    plasticReduction: 25,
    waterSaving: 15,
    energySaving: 30,
    wasteReduction: 40,
    ecoScore: 28,
    co2Saved: 12,
    moneySaved: 45
  });

  const [dailyActions, setDailyActions] = useLocalStorage<DailyAction[]>('eco-daily-actions', [
    {
      id: '1',
      title: 'Utiliser ma gourde réutilisable',
      description: 'Éviter d\'acheter des bouteilles en plastique aujourd\'hui',
      category: 'plastic',
      impact: { plasticReduction: 5, co2Saved: 0.1, moneySaved: 2, ecoScore: 3 },
      completed: false,
      streak: 0
    },
    {
      id: '2',
      title: 'Prendre une douche de 5 minutes max',
      description: 'Limiter ma consommation d\'eau chaude',
      category: 'water',
      impact: { waterSaving: 8, energySaving: 3, co2Saved: 0.8, moneySaved: 1.5, ecoScore: 4 },
      completed: false,
      streak: 0
    },
    {
      id: '3',
      title: 'Débrancher mes appareils en veille',
      description: 'Éteindre complètement TV, ordinateur, chargeurs...',
      category: 'energy',
      impact: { energySaving: 5, co2Saved: 0.5, moneySaved: 1, ecoScore: 2 },
      completed: false,
      streak: 0
    },
    {
      id: '4',
      title: 'Utiliser mes sacs réutilisables',
      description: 'Faire mes courses sans sacs plastiques',
      category: 'plastic',
      impact: { plasticReduction: 3, co2Saved: 0.2, moneySaved: 0.5, ecoScore: 2 },
      completed: false,
      streak: 0
    },
    {
      id: '5',
      title: 'Trier mes déchets correctement',
      description: 'Séparer recyclables, compost et déchets ménagers',
      category: 'waste',
      impact: { wasteReduction: 10, co2Saved: 0.3, moneySaved: 0.8, ecoScore: 3 },
      completed: false,
      streak: 0
    }
  ]);

  const [feedback, setFeedback] = useState<string>('');
  const [achievements, setAchievements] = useLocalStorage<string[]>('eco-achievements', []);

  // Check if actions need to be reset (new day)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('eco-last-reset-date');
    
    if (lastResetDate !== today) {
      // Reset daily actions for new day
      setDailyActions(prev => prev.map(action => ({
        ...action,
        completed: false
      })));
      localStorage.setItem('eco-last-reset-date', today);
    }
  }, [setDailyActions]);

  const completeAction = (actionId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setDailyActions(prev => prev.map(action => {
      if (action.id === actionId && !action.completed) {
        const isConsecutiveDay = action.lastCompleted && 
          new Date(action.lastCompleted).getTime() === new Date(today).getTime() - 24 * 60 * 60 * 1000;
        
        const updatedAction = { 
          ...action, 
          completed: true,
          streak: isConsecutiveDay ? action.streak + 1 : 1,
          lastCompleted: today
        };
        
        // Update personal stats
        setPersonalStats(prevStats => ({
          ...prevStats,
          plasticReduction: Math.min(100, prevStats.plasticReduction + (action.impact.plasticReduction || 0)),
          waterSaving: Math.min(100, prevStats.waterSaving + (action.impact.waterSaving || 0)),
          energySaving: Math.min(100, prevStats.energySaving + (action.impact.energySaving || 0)),
          wasteReduction: Math.min(100, prevStats.wasteReduction + (action.impact.wasteReduction || 0)),
          ecoScore: Math.min(100, prevStats.ecoScore + action.impact.ecoScore),
          co2Saved: prevStats.co2Saved + action.impact.co2Saved,
          moneySaved: prevStats.moneySaved + action.impact.moneySaved
        }));

        setFeedback(`Bravo ! Vous avez économisé ${action.impact.co2Saved}kg de CO₂ et ${action.impact.moneySaved}€ !`);
        
        // Check for streak achievements
        if (updatedAction.streak === 7) {
          setAchievements(prev => {
            const newAchievement = `${action.title} - 7 jours d'affilée !`;
            if (!prev.includes(newAchievement)) {
              return [...prev, newAchievement];
            }
            return prev;
          });
        }
        
        return updatedAction;
      }
      return action;
    }));

    setTimeout(() => setFeedback(''), 3000);
  };

  const getCategoryIcon = (category: string, actionTitle: string) => {
    // Use specific images for each action based on title
    if (actionTitle === 'Utiliser ma gourde réutilisable') {
      return (
        <img 
          src="/lovable-uploads/bb418375-903a-4916-a337-626f64bcb44a.png"
          alt="Water bottle"
          className="h-32 w-32 object-cover rounded-lg"
        />
      );
    }
    
    if (actionTitle === 'Prendre une douche de 5 minutes max') {
      return (
        <img 
          src="/lovable-uploads/2c915ebe-8ced-4c78-aec9-5b332c618103.png"
          alt="Shower scene"
          className="h-32 w-32 object-cover rounded-lg"
        />
      );
    }
    
    if (actionTitle === 'Débrancher mes appareils en veille') {
      return (
        <img 
          src="/lovable-uploads/f61e13c0-e71c-4e88-8173-fd43fc72045c.png"
          alt="TV with power button"
          className="h-32 w-32 object-cover rounded-lg"
        />
      );
    }

    if (actionTitle === 'Utiliser mes sacs réutilisables') {
      return (
        <img 
          src="/lovable-uploads/39241fbd-ac8b-4210-b92c-65a3bf26552f.png"
          alt="Reusable bag"
          className="h-32 w-32 object-cover rounded-lg"
        />
      );
    }

    if (actionTitle === 'Trier mes déchets correctement') {
      return (
        <img 
          src="/lovable-uploads/61753b80-33b0-4d52-94ea-72afbfaff0a3.png"
          alt="Waste sorting"
          className="h-32 w-32 object-cover rounded-lg"
        />
      );
    }

    // Fallback to a default eco image for any other actions
    return (
      <img 
        src="/lovable-uploads/bb418375-903a-4916-a337-626f64bcb44a.png"
        alt="Eco action"
        className="h-32 w-32 object-cover rounded-lg"
      />
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'plastic': return 'bg-red-100 text-red-800';
      case 'water': return 'bg-blue-100 text-blue-800';
      case 'energy': return 'bg-yellow-100 text-yellow-800';
      case 'waste': return 'bg-green-100 text-green-800';
      case 'transport': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedToday = dailyActions.filter(action => action.completed).length;
  const totalActions = dailyActions.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-eco-green-700 mb-2">Mon Défi Écologique</h1>
        <p className="text-lg text-eco-green-600">Suivez vos actions quotidiennes pour la planète</p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Badge variant="outline" className="bg-eco-green-100 text-eco-green-800">
            {completedToday}/{totalActions} actions aujourd'hui
          </Badge>
          <Badge variant="outline" className="bg-eco-blue-100 text-eco-blue-800">
            {personalStats.co2Saved.toFixed(1)}kg CO₂ économisé ce mois
          </Badge>
          <Badge variant="outline" className="bg-eco-earth-100 text-eco-earth-800">
            {personalStats.moneySaved.toFixed(0)}€ économisés ce mois
          </Badge>
        </div>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-effect transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-red-600" />
              Réduction Plastique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={personalStats.plasticReduction} className="flex-1" />
              <span className="text-sm font-bold text-eco-green-700">{personalStats.plasticReduction}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              Économie d'Eau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={personalStats.waterSaving} className="flex-1" />
              <span className="text-sm font-bold text-eco-green-700">{personalStats.waterSaving}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-yellow-600" />
              Économie d'Énergie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={personalStats.energySaving} className="flex-1" />
              <span className="text-sm font-bold text-eco-green-700">{personalStats.energySaving}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect transition-all duration-300 hover:scale-105 ring-2 ring-eco-green-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Score Écologique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={personalStats.ecoScore} className="flex-1" />
              <span className="text-sm font-bold text-eco-green-700">{personalStats.ecoScore}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-eco-green-700 text-xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Mes Actions Quotidiennes
          </CardTitle>
          <p className="text-eco-green-600">Complétez ces actions pour améliorer votre impact environnemental</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyActions.map(action => (
              <div 
                key={action.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  action.completed 
                    ? 'bg-eco-green-50 border-eco-green-200 opacity-75' 
                    : 'bg-white border-gray-200 hover:border-eco-green-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(action.category, action.title)}
                    </div>
                    <div>
                      <h3 className={`font-medium ${action.completed ? 'text-eco-green-700' : 'text-gray-900'}`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>💚 {action.impact.co2Saved}kg CO₂</span>
                        <span>💰 {action.impact.moneySaved}€</span>
                        {action.streak > 0 && <span>🔥 {action.streak} jours</span>}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => completeAction(action.id)}
                    disabled={action.completed}
                    className={`${
                      action.completed 
                        ? 'bg-eco-green-500 text-white cursor-default' 
                        : 'bg-eco-green-500 hover:bg-eco-green-600 text-white'
                    }`}
                  >
                    {action.completed ? '✓ Fait' : 'Valider'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-eco-green-700 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Mes Réussites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge 
                  key={index} 
                  className="bg-eco-green-500 text-white animate-bounce-gentle"
                >
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {feedback && (
        <Card className="glass-effect border-eco-blue-300 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-eco-blue-700">
              <Leaf className="h-5 w-5 animate-pulse-eco" />
              <p className="font-medium">{feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalEcoTracker;
