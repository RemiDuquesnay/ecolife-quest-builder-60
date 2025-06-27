
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalEcoTracker from '@/components/PersonalEcoTracker';
import ChallengeSystem from '@/components/ChallengeSystem';
import EcoTipsPanel from '@/components/EcoTipsPanel';
import { Leaf, Target, Lightbulb, Trophy, User, Recycle } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 via-eco-blue-50 to-eco-earth-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-eco-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-eco-green-500 rounded-full animate-pulse-eco">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-eco-green-700">EcoLife Quest</h1>
                <p className="text-sm text-eco-green-600">Mon Quotidien Écologique</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-eco-green-600">
                  <Recycle className="h-4 w-4" />
                  <span>Actions quotidiennes</span>
                </div>
                <div className="flex items-center gap-2 text-eco-blue-600">
                  <Trophy className="h-4 w-4" />
                  <span>Défis personnels</span>
                </div>
                <div className="flex items-center gap-2 text-eco-earth-600">
                  <Leaf className="h-4 w-4" />
                  <span>Conseils pratiques</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white/70 backdrop-blur-sm border border-eco-green-200">
              <TabsTrigger 
                value="personal" 
                className="flex items-center gap-2 data-[state=active]:bg-eco-green-500 data-[state=active]:text-white"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Mon Quotidien</span>
              </TabsTrigger>
              <TabsTrigger 
                value="challenges" 
                className="flex items-center gap-2 data-[state=active]:bg-eco-green-500 data-[state=active]:text-white"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Défis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tips" 
                className="flex items-center gap-2 data-[state=active]:bg-eco-green-500 data-[state=active]:text-white"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Conseils</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="personal" className="space-y-6">
            <PersonalEcoTracker />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <ChallengeSystem />
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <EcoTipsPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-eco-green-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                EcoLife Quest
              </h3>
              <p className="text-eco-green-100">
                Suivez vos actions quotidiennes pour réduire votre impact environnemental 
                et adopter un mode de vie plus durable, étape par étape.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Actions Personnelles</h4>
              <ul className="space-y-2 text-eco-green-100">
                <li>• Réduire le plastique au quotidien</li>
                <li>• Économiser l'eau et l'énergie</li>
                <li>• Améliorer le tri des déchets</li>
                <li>• Adopter la mobilité douce</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Votre Impact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-eco-green-400 rounded-full animate-pulse-eco"></div>
                  <span className="text-eco-green-100">Actions mesurables</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-eco-blue-400 rounded-full animate-pulse-eco"></div>
                  <span className="text-eco-green-100">Économies réelles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-eco-earth-400 rounded-full animate-pulse-eco"></div>
                  <span className="text-eco-green-100">Habitudes durables</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-eco-green-700 mt-8 pt-8 text-center text-eco-green-200">
            <p>&copy; 2024 EcoLife Quest - Votre quotidien éco-responsable 🌱</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
