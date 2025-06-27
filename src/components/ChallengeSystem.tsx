import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, Star, Gift, User, Zap } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  progress: number;
  target: number;
  reward: {
    type: 'badge' | 'points';
    value: string | number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  deadline?: Date;
  completed: boolean;
}

const ChallengeSystem = () => {
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('eco-challenges', [
    {
      id: '1',
      title: 'Semaine Sans Plastique',
      description: 'Évitez tout plastique à usage unique pendant 7 jours',
      type: 'weekly',
      progress: 3,
      target: 7,
      reward: { type: 'badge', value: 'Guerrier Anti-Plastique' },
      difficulty: 'medium',
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '2',
      title: 'Douches Efficaces',
      description: 'Prendre des douches de moins de 5 minutes pendant 10 jours',
      type: 'daily',
      progress: 6,
      target: 10,
      reward: { type: 'points', value: 200 },
      difficulty: 'easy',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '3',
      title: 'Maître du Compost',
      description: 'Composter tous vos déchets organiques pendant 1 mois',
      type: 'monthly',
      progress: 15,
      target: 30,
      reward: { type: 'badge', value: 'Champion du Compost' },
      difficulty: 'hard',
      completed: false
    },
    {
      id: '4',
      title: 'Transport Vert',
      description: 'Utiliser vélo/marche/transport en commun 5 fois cette semaine',
      type: 'weekly',
      progress: 2,
      target: 5,
      reward: { type: 'points', value: 150 },
      difficulty: 'medium',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '5',
      title: 'Économe en Énergie',
      description: 'Débrancher tous les appareils en veille chaque soir',
      type: 'daily',
      progress: 8,
      target: 14,
      reward: { type: 'badge', value: 'Économiseur d\'Énergie' },
      difficulty: 'easy',
      completed: false
    }
  ]);

  const [userPoints, setUserPoints] = useLocalStorage<number>('eco-user-points', 320);
  const [userBadges, setUserBadges] = useLocalStorage<string[]>('eco-user-badges', ['Éco-Débutant', 'Premier Geste']);

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
      setUserBadges(prev => {
        const newBadge = challenge.reward.value as string;
        if (!prev.includes(newBadge)) {
          return [...prev, newBadge];
        }
        return prev;
      });
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
      case 'monthly': return <Trophy className="h-4 w-4" />;
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
      const activeChallenges = challenges.filter(c => !c.completed);
      if (activeChallenges.length > 0) {
        const randomChallenge = activeChallenges[Math.floor(Math.random() * activeChallenges.length)];
        if (Math.random() > 0.8) {
          const increment = Math.floor(Math.random() * 2) + 1;
          updateChallengeProgress(randomChallenge.id, Math.min(randomChallenge.target, randomChallenge.progress + increment));
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [challenges]);

  return (
    <div className="p-6 space-y-6">
      {/* Header with user stats */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-eco-green-700">Mes Défis Personnels</h1>
          <p className="text-eco-green-600">Relevez des défis à votre échelle pour changer vos habitudes !</p>
        </div>
        <Card className="glass-effect">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-eco-green-700 flex items-center gap-1">
                  <Zap className="h-5 w-5" />
                  {userPoints}
                </div>
                <div className="text-sm text-eco-green-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-eco-blue-700 flex items-center gap-1">
                  <Trophy className="h-5 w-5" />
                  {userBadges.length}
                </div>
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
            Défis en Cours
          </h2>
          
          {challenges.filter(c => !c.completed).map(challenge => (
            <Card 
              key={challenge.id} 
              className="glass-effect transition-all duration-300 hover:scale-105 hover:eco-glow"
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
                    <span className="font-medium">{challenge.progress}/{challenge.target} jours</span>
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
                         `Badge: ${challenge.reward.value}`}
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
              <div className="grid grid-cols-1 gap-3">
                {userBadges.map((badge, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-eco-green-50 rounded-lg border border-eco-green-200 animate-float"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <Trophy className="h-5 w-5 text-eco-green-600" />
                    <span className="font-medium text-eco-green-700">{badge}</span>
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
                Défis Réussis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenges.filter(c => c.completed).length === 0 ? (
                <p className="text-eco-green-600 text-center py-4">
                  Aucun défi terminé pour le moment.<br/>
                  <span className="text-sm">Continuez vos efforts quotidiens !</span>
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
                        ✓ Réussi
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
