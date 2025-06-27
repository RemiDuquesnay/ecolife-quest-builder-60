import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Recycle, Leaf, Droplets, ShoppingBag, Car, Home, Utensils } from 'lucide-react';

interface EcoTip {
  id: string;
  category: 'plastic' | 'transport' | 'home' | 'food' | 'general';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  co2Saved: number; // kg CO2 per year
  moneySaved: number; // euros per year
}

const EcoTipsPanel = () => {
  const [currentTip, setCurrentTip] = useState<EcoTip | null>(null);
  const [favoriteTips, setFavoriteTips] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const ecoTips: EcoTip[] = [
    {
      id: '1',
      category: 'plastic',
      title: 'Utilisez une gourde réutilisable',
      description: 'Remplacez les bouteilles en plastique par une gourde réutilisable. Vous éviterez 167 bouteilles plastiques par an !',
      impact: 'high',
      difficulty: 'easy',
      co2Saved: 23,
      moneySaved: 120
    },
    {
      id: '2',
      category: 'plastic',
      title: 'Sacs réutilisables pour les courses',
      description: 'Gardez toujours des sacs réutilisables dans votre voiture ou sac à main. Fini les sacs plastiques !',
      impact: 'medium',
      difficulty: 'easy',
      co2Saved: 12,
      moneySaved: 30
    },
    {
      id: '3',
      category: 'transport',
      title: 'Covoiturage et transports en commun',
      description: 'Utilisez le covoiturage ou les transports en commun 2 fois par semaine. Réduisez votre empreinte carbone significativement.',
      impact: 'high',
      difficulty: 'medium',
      co2Saved: 480,
      moneySaved: 800
    },
    {
      id: '4',
      category: 'home',
      title: 'Réduisez le chauffage de 1°C',
      description: 'Baisser votre thermostat de seulement 1°C peut réduire votre consommation d\'énergie de 7%.',
      impact: 'medium',
      difficulty: 'easy',
      co2Saved: 230,
      moneySaved: 180
    },
    {
      id: '5',
      category: 'food',
      title: 'Réduisez le gaspillage alimentaire',
      description: 'Planifiez vos repas et utilisez vos restes. Le gaspillage alimentaire représente 8% des émissions mondiales.',
      impact: 'high',
      difficulty: 'medium',
      co2Saved: 300,
      moneySaved: 400
    },
    {
      id: '6',
      category: 'plastic',
      title: 'Évitez les produits sur-emballés',
      description: 'Choisissez des produits avec moins d\'emballage ou en vrac. Privilégiez les emballages recyclables.',
      impact: 'medium',
      difficulty: 'medium',
      co2Saved: 45,
      moneySaved: 60
    },
    {
      id: '7',
      category: 'home',
      title: 'Débranchez vos appareils',
      description: 'Les appareils en veille consomment jusqu\'à 10% de votre électricité. Débranchez-les quand vous ne les utilisez pas.',
      impact: 'medium',
      difficulty: 'easy',
      co2Saved: 67,
      moneySaved: 85
    },
    {
      id: '8',
      category: 'general',
      title: 'Réparez au lieu de jeter',
      description: 'Réparez vos objets cassés ou donnez-leur une seconde vie. L\'économie circulaire commence chez vous !',
      impact: 'high',
      difficulty: 'medium',
      co2Saved: 150,
      moneySaved: 250
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: Leaf },
    { id: 'plastic', name: 'Plastique', icon: ShoppingBag },
    { id: 'transport', name: 'Transport', icon: Car },
    { id: 'home', name: 'Maison', icon: Home },
    { id: 'food', name: 'Alimentation', icon: Utensils },
    { id: 'general', name: 'Général', icon: Recycle }
  ];

  const getRandomTip = (category?: string) => {
    let filteredTips = ecoTips;
    if (category && category !== 'all') {
      filteredTips = ecoTips.filter(tip => tip.category === category);
    }
    return filteredTips[Math.floor(Math.random() * filteredTips.length)];
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-eco-green-500 text-white';
      case 'medium': return 'bg-eco-earth-500 text-white';
      case 'low': return 'bg-eco-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-eco-green-100 text-eco-green-800';
      case 'medium': return 'bg-eco-earth-100 text-eco-earth-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plastic': return <ShoppingBag className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'home': return <Home className="h-4 w-4" />;
      case 'food': return <Utensils className="h-4 w-4" />;
      default: return <Leaf className="h-4 w-4" />;
    }
  };

  const toggleFavorite = (tipId: string) => {
    setFavoriteTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  useEffect(() => {
    setCurrentTip(getRandomTip());
    
    // Change tip every 15 seconds
    const interval = setInterval(() => {
      setCurrentTip(getRandomTip(selectedCategory));
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedCategory]);

  const filteredTips = selectedCategory === 'all' 
    ? ecoTips 
    : ecoTips.filter(tip => tip.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-eco-green-700 mb-2">Conseils Écologiques</h1>
        <p className="text-eco-green-600">Découvrez des astuces pour réduire votre impact environnemental</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 ${
                selectedCategory === category.id 
                  ? 'bg-eco-green-500 hover:bg-eco-green-600 text-white' 
                  : 'hover:bg-eco-green-50'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Tip */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-eco-green-700 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 animate-pulse-eco" />
            Conseil du Moment
          </h2>
          
          {currentTip && (
            <Card className="glass-effect eco-glow transition-all duration-500 hover:scale-105">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(currentTip.category)}
                    <CardTitle className="text-xl text-eco-green-700">
                      {currentTip.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(currentTip.id)}
                    className={`p-2 ${favoriteTips.includes(currentTip.id) ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    ♥
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Badge className={getImpactColor(currentTip.impact)}>
                    Impact {currentTip.impact === 'high' ? 'Élevé' : 
                            currentTip.impact === 'medium' ? 'Moyen' : 'Faible'}
                  </Badge>
                  <Badge className={getDifficultyColor(currentTip.difficulty)}>
                    {currentTip.difficulty === 'easy' ? 'Facile' :
                     currentTip.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-eco-green-600 mb-6 text-lg">{currentTip.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-eco-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-eco-green-700">{currentTip.co2Saved}</div>
                    <div className="text-sm text-eco-green-600">kg CO₂ économisés/an</div>
                  </div>
                  <div className="text-center p-4 bg-eco-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-eco-blue-700">{currentTip.moneySaved}€</div>
                    <div className="text-sm text-eco-blue-600">économisés/an</div>
                  </div>
                </div>

                <Button 
                  onClick={() => setCurrentTip(getRandomTip(selectedCategory))}
                  className="w-full bg-eco-green-500 hover:bg-eco-green-600 text-white"
                >
                  Nouveau Conseil
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* All Tips List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-eco-green-700 flex items-center gap-2">
            <Recycle className="h-6 w-6" />
            Tous les Conseils
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredTips.map(tip => (
              <Card 
                key={tip.id} 
                className={`glass-effect transition-all duration-300 hover:scale-105 cursor-pointer ${
                  currentTip?.id === tip.id ? 'ring-2 ring-eco-green-400' : ''
                }`}
                onClick={() => setCurrentTip(tip)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(tip.category)}
                      <h3 className="font-semibold text-eco-green-700">{tip.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tip.id);
                      }}
                      className={`p-1 ${favoriteTips.includes(tip.id) ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      ♥
                    </Button>
                  </div>
                  
                  <p className="text-sm text-eco-green-600 mb-2">{tip.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      <Badge className={getImpactColor(tip.impact)}>
                        {tip.impact === 'high' ? 'Élevé' : 
                         tip.impact === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                    </div>
                    <div className="text-xs text-eco-green-600">
                      {tip.co2Saved}kg CO₂ • {tip.moneySaved}€/an
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteTips.length > 0 && (
        <Card className="glass-effect mt-8">
          <CardHeader>
            <CardTitle className="text-eco-green-700 flex items-center gap-2">
              ♥ Mes Conseils Favoris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecoTips.filter(tip => favoriteTips.includes(tip.id)).map(tip => (
                <div key={tip.id} className="p-3 bg-eco-green-50 rounded-lg border border-eco-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(tip.category)}
                    <span className="font-medium text-eco-green-700">{tip.title}</span>
                  </div>
                  <div className="text-xs text-eco-green-600">
                    {tip.co2Saved}kg CO₂ • {tip.moneySaved}€ économisés par an
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EcoTipsPanel;
