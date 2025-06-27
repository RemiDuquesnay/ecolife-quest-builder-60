
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, Star, Gift } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  target: number;
  reward: {
    type: 'badge' | 'points' | 'unlock';
    value: string | number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  deadline?: Date;
  completed: boolean;
}

const ChallengeSystem = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Réducteur de Plastique',
      description: 'Réduisez l\'usage de plastique de votre ville de 15%',
      type: 'daily',
      progress: 8,
      target: 15,
      reward: { type: 'badge', value: 'Gardien des Océans' },
      difficulty: 'medium',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '2',
      title: 'Maître du Recyclage',
      description: 'Atteignez 80% d\'efficacité dans la gestion des déchets',
      type: 'weekly',
      progress: 65,
      target: 80,
      reward: { type: 'points', value: 500 },
      difficulty: 'hard',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '3',
      title: 'Ville Verte',
      description: 'Maintenez un score écologique supérieur à 70',
      type: 'achievement',
      progress: 45,
      target: 70,
      reward: { type: 'unlock', value: 'Nouveaux bâtiments écologiques' },
      difficulty: 'hard',
      completed: false
    },
    {
      id: '4',
      title: 'Transport Propre',
      description: 'Implémentez 3 solutions de transport écologique',
      type: 'daily',
      progress: 1,
      target: 3,
      reward: { type: 'badge', value: 'Mobilité Verte' },
      difficulty: 'easy',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false
    }
  ]);

  const [userPoints, setUserPoints] = useState(750);
  const [userBadges, setUserBadges] = useState(['Débutant Écologique', 'Premier Pas']);

  const updateChallengeProgress = (challengeId: string, newProgress: number) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        const updatedChallenge = { ...challenge, progress: newProgress };
        if (newProgress >= challenge.target && !challenge.completed) {
          updatedChallenge.completed = true;
          handleChallengeCompletion(challenge);
        }
        return updatedChallenge;
      }
      return challenge;
    }));
  };

  const handleChallengeCompletion = (challenge: Challenge) => {
    if (challenge.reward.type === 'points') {
      setUserPoints(prev => prev + (challenge.reward.value as number));
    } else if (challenge.reward.type === 'badge') {
      setUserBadges(prev => [...prev, challenge.reward.value as string]);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const formatTimeRemaining = (deadline?: Date) => {
    if (!deadline) return '';
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Simulate challenge progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      if (!randomChallenge.completed && Math.random() > 0.7) {
        const increment = Math.floor(Math.random() * 5) + 1;
        updateChallengeProgress(randomChallenge.id, Math.min(randomChallenge.target, randomChallenge.progress + increment));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [challenges]);

  return (
    <div className="p-6 space-y-6">
      {/* Header with user stats */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-eco-green-700">Défis Écologiques</h1>
          <p className="text-eco-green-600">Relevez des défis pour sauver la planète !</p>
        </div>
        <Card className="glass-effect">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-eco-green-700">{userPoints}</div>
                <div className="text-sm text-eco-green-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-eco-blue-700">{userBadges.length}</div>
                <div className="text-sm text-eco-blue-600">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-eco-green-700 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Défis Actifs
          </h2>
          
          {challenges.filter(c => !c.completed).map(challenge => (
            <Card 
              key={challenge.id} 
              className={`glass-effect transition-all duration-300 hover:scale-105 ${
                challenge.completed ? 'opacity-50' : 'hover:eco-glow'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(challenge.type)}
                    <CardTitle className="text-lg text-eco-green-700">
                      {challenge.title}
                    </CardTitle>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty === 'easy' ? 'Facile' :
                       challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                    </Badge>
                    {challenge.deadline && (
                      <Badge variant="outline" className="text-xs">
                        {formatTimeRemaining(challenge.deadline)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-eco-green-600 mb-4">{challenge.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span className="font-medium">{challenge.progress}/{challenge.target}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-eco-green-600">
                      <Gift className="h-4 w-4" />
                      <span>
                        {challenge.reward.type === 'points' ? `${challenge.reward.value} points` :
                         challenge.reward.type === 'badge' ? `Badge: ${challenge.reward.value}` :
                         challenge.reward.value}
                      </span>
                    </div>
                    
                    {challenge.progress >= challenge.target && (
                      <Badge className="bg-eco-green-500 text-white animate-pulse-eco">
                        Terminé !
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completed Challenges & Badges */}
        <div className="space-y-6">
          {/* User Badges */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-eco-green-700 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Mes Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {userBadges.map((badge, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-eco-green-50 rounded-lg border border-eco-green-200 animate-float"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <Trophy className="h-5 w-5 text-eco-green-600" />
                    <span className="text-sm font-medium text-eco-green-700">{badge}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Challenges */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-eco-green-700 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Défis Terminés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenges.filter(c => c.completed).length === 0 ? (
                <p className="text-eco-green-600 text-center py-4">
                  Aucun défi terminé pour le moment. Continuez vos efforts !
                </p>
              ) : (
                <div className="space-y-3">
                  {challenges.filter(c => c.completed).map(challenge => (
                    <div 
                      key={challenge.id}
                      className="flex items-center justify-between p-3 bg-eco-green-50 rounded-lg border border-eco-green-200"
                    >
                      <div>
                        <div className="font-medium text-eco-green-700">{challenge.title}</div>
                        <div className="text-sm text-eco-green-600">
                          Récompense: {challenge.reward.type === 'points' ? `${challenge.reward.value} points` : challenge.reward.value}
                        </div>
                      </div>
                      <Badge className="bg-eco-green-500 text-white">
                        ✓ Terminé
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSystem;
