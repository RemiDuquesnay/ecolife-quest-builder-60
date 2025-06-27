import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Recycle, Leaf, Droplets, Car, ShoppingBag, Factory, TreePine, Trophy } from 'lucide-react';

interface CityStats {
  pollution: number;
  biodiversity: number;
  wasteManagement: number;
  plasticUsage: number;
  ecoScore: number;
  population: number;
  happiness: number;
}

interface Decision {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    impact: Partial<CityStats>;
    cost: number;
  }[];
  category: 'plastic' | 'transport' | 'waste' | 'energy';
}

const CityManagement = () => {
  const [cityStats, setCityStats] = useState<CityStats>({
    pollution: 60,
    biodiversity: 40,
    wasteManagement: 50,
    plasticUsage: 70,
    ecoScore: 35,
    population: 10000,
    happiness: 60
  });

  const [budget, setBudget] = useState(1000);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [achievements, setAchievements] = useState<string[]>([]);

  const decisions: Decision[] = [
    {
      id: '1',
      title: 'Politique des Sacs Plastiques',
      description: 'Comment gérer l\'utilisation des sacs plastiques dans votre ville ?',
      category: 'plastic',
      options: [
        {
          text: 'Interdire tous les sacs plastiques',
          impact: { plasticUsage: -20, pollution: -15, ecoScore: 15, happiness: -5 },
          cost: 200
        },
        {
          text: 'Taxer les sacs plastiques',
          impact: { plasticUsage: -10, pollution: -8, ecoScore: 8 },
          cost: 50
        },
        {
          text: 'Ne rien changer',
          impact: { plasticUsage: 5, pollution: 3, happiness: 5 },
          cost: 0
        }
      ]
    },
    {
      id: '2',
      title: 'Transport Public Écologique',
      description: 'Comment améliorer les transports dans votre ville ?',
      category: 'transport',
      options: [
        {
          text: 'Bus électriques pour toute la ville',
          impact: { pollution: -25, ecoScore: 20, happiness: 10 },
          cost: 500
        },
        {
          text: 'Pistes cyclables étendues',
          impact: { pollution: -15, ecoScore: 12, happiness: 8 },
          cost: 300
        },
        {
          text: 'Maintenir le système actuel',
          impact: { pollution: 2, happiness: -3 },
          cost: 0
        }
      ]
    },
    {
      id: '3',
      title: 'Centre de Recyclage',
      description: 'Que faire pour améliorer la gestion des déchets ?',
      category: 'waste',
      options: [
        {
          text: 'Construire un centre de tri moderne',
          impact: { wasteManagement: 30, ecoScore: 15, pollution: -10 },
          cost: 400
        },
        {
          text: 'Programme de compostage communautaire',
          impact: { wasteManagement: 15, biodiversity: 10, ecoScore: 12 },
          cost: 150
        },
        {
          text: 'Continuer avec le système actuel',
          impact: { pollution: 3, wasteManagement: -5 },
          cost: 0
        }
      ]
    }
  ];

  const generateFeedback = (decision: Decision, optionIndex: number) => {
    const feedbacks = {
      plastic: [
        'Excellente décision ! Réduire le plastique protège nos océans et notre faune.',
        'Un bon compromis qui sensibilise sans être trop contraignant.',
        'Cette décision pourrait avoir des conséquences négatives sur l\'environnement à long terme.'
      ],
      transport: [
        'Formidable ! Les transports électriques réduisent drastiquement les émissions.',
        'Les pistes cyclables encouragent un mode de vie sain et écologique.',
        'Manquer cette opportunité d\'améliorer la qualité de l\'air est regrettable.'
      ],
      waste: [
        'Investir dans le recyclage moderne est crucial pour l\'économie circulaire.',
        'Le compostage communautaire renforce les liens sociaux et réduit les déchets.',
        'Sans amélioration de la gestion des déchets, la situation va se dégrader.'
      ]
    };
    
    return feedbacks[decision.category][optionIndex] || 'Décision prise !';
  };

  const handleDecision = (optionIndex: number) => {
    if (!currentDecision) return;
    
    const option = currentDecision.options[optionIndex];
    
    if (budget < option.cost) {
      setFeedback('Budget insuffisant pour cette action !');
      return;
    }

    setBudget(prev => prev - option.cost);
    setCityStats(prev => {
      const newStats = { ...prev };
      Object.entries(option.impact).forEach(([key, value]) => {
        if (key in newStats && typeof value === 'number') {
          (newStats as any)[key] = Math.max(0, Math.min(100, newStats[key as keyof CityStats] + value));
        }
      });
      return newStats;
    });

    setFeedback(generateFeedback(currentDecision, optionIndex));
    
    // Check for achievements
    checkAchievements();
    
    // Generate new decision after delay
    setTimeout(() => {
      const randomDecision = decisions[Math.floor(Math.random() * decisions.length)];
      setCurrentDecision(randomDecision);
      setFeedback('');
    }, 3000);
  };

  const checkAchievements = () => {
    const newAchievements = [];
    if (cityStats.ecoScore >= 70 && !achievements.includes('Ville Verte')) {
      newAchievements.push('Ville Verte');
    }
    if (cityStats.plasticUsage <= 30 && !achievements.includes('Zéro Plastique')) {
      newAchievements.push('Zéro Plastique');
    }
    if (cityStats.pollution <= 20 && !achievements.includes('Air Pur')) {
      newAchievements.push('Air Pur');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  useEffect(() => {
    setCurrentDecision(decisions[0]);
    
    // Budget increases over time
    const budgetInterval = setInterval(() => {
      setBudget(prev => prev + 50);
    }, 10000);

    return () => clearInterval(budgetInterval);
  }, []);

  const getStatColor = (value: number, reversed = false) => {
    if (reversed) value = 100 - value;
    if (value >= 70) return 'bg-eco-green-500';
    if (value >= 40) return 'bg-eco-earth-500';
    return 'bg-red-500';
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'pollution': return <Factory className="h-4 w-4" />;
      case 'biodiversity': return <TreePine className="h-4 w-4" />;
      case 'wasteManagement': return <Recycle className="h-4 w-4" />;
      case 'plasticUsage': return <ShoppingBag className="h-4 w-4" />;
      case 'ecoScore': return <Leaf className="h-4 w-4" />;
      case 'happiness': return <Droplets className="h-4 w-4" />;
      default: return <Leaf className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-eco-green-700 mb-2">EcoLife Quest</h1>
        <p className="text-lg text-eco-green-600">Gérez votre ville écologique</p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Badge variant="outline" className="bg-eco-earth-100 text-eco-earth-800">
            Budget: {budget}€
          </Badge>
          <Badge variant="outline" className="bg-eco-blue-100 text-eco-blue-800">
            Population: {cityStats.population.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* City Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(cityStats).map(([key, value]) => (
          <Card key={key} className={`glass-effect transition-all duration-300 hover:scale-105 ${
            key === 'ecoScore' ? 'ring-2 ring-eco-green-400' : ''
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getStatIcon(key)}
                {key === 'pollution' ? 'Pollution' :
                 key === 'biodiversity' ? 'Biodiversité' :
                 key === 'wasteManagement' ? 'Gestion Déchets' :
                 key === 'plasticUsage' ? 'Usage Plastique' :
                 key === 'ecoScore' ? 'Score Écologique' :
                 key === 'happiness' ? 'Bonheur' : key}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress 
                  value={value} 
                  className="flex-1"
                />
                <span className="text-sm font-bold text-eco-green-700">{Math.round(value)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="glass-effect mb-6">
          <CardHeader>
            <CardTitle className="text-eco-green-700 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Réussites Débloquées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map(achievement => (
                <Badge 
                  key={achievement} 
                  className="bg-eco-green-500 text-white animate-bounce-gentle"
                >
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Decision */}
      {currentDecision && (
        <Card className="glass-effect eco-glow">
          <CardHeader>
            <CardTitle className="text-eco-green-700 text-xl">
              {currentDecision.title}
            </CardTitle>
            <p className="text-eco-green-600">{currentDecision.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentDecision.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleDecision(index)}
                  className={`w-full p-4 h-auto text-left justify-start transition-all duration-200 ${
                    budget < option.cost 
                      ? 'opacity-50 cursor-not-allowed bg-gray-300' 
                      : 'bg-eco-green-500 hover:bg-eco-green-600 text-white hover:scale-102'
                  }`}
                  disabled={budget < option.cost}
                >
                  <div>
                    <div className="font-medium">{option.text}</div>
                    <div className="text-sm opacity-90">Coût: {option.cost}€</div>
                  </div>
                </Button>
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

export default CityManagement;
