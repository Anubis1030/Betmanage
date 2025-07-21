import { Button } from "@/components/ui/button";
import { TrendingUp, Trophy, Target, Zap, Users } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-black dark:via-blue-950 dark:to-black overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #06b6d4 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Decorative circles with animation */}
      <div className="absolute top-20 right-20 w-96 h-96 border-4 border-cyan-500/20 rounded-full animate-spin" style={{animationDuration: '30s'}}></div>
      <div className="absolute top-32 right-32 w-64 h-64 border-2 border-cyan-400/30 rounded-full animate-spin" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
      <div className="absolute top-40 right-40 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
      
      <div className="container mx-auto px-4 h-full flex items-center py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Content */}
          <div className="space-y-10 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-semibold backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              #1 Football Prediction Platform
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 leading-tight">
                FOOTBALL
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 drop-shadow-2xl">
                  PREDICTIONS
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                Master the art of prediction. Compete with colleagues, earn rewards, and prove your football expertise in our cutting-edge betting platform.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">150+</div>
                <div className="text-sm">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">2.5M</div>
                <div className="text-sm">Coins Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">95%</div>
                <div className="text-sm">Accuracy Rate</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105 group border border-cyan-400/20"
              >
                <TrendingUp className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                START PREDICTING
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Users className="mr-2" />
                Join Community
              </Button>
            </div>
          </div>

          {/* Right Content - Enhanced Visual */}
          <div className="relative flex justify-center items-center lg:justify-end hidden md:flex">
            <div className="relative">
              {/* Main trophy with enhanced effects */}
              <div className="relative z-20">
                <div className="w-80 h-80 bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-700 hover:scale-110 group">
                  <Trophy className="w-40 h-40 text-white group-hover:rotate-12 transition-transform duration-700" />
                </div>
              </div>
              
              {/* Rotating ring */}
              <div className="absolute inset-0 w-80 h-80 border-4 border-dashed border-cyan-300/50 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
              
              {/* Floating action icons */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="absolute top-1/2 -left-12 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-ping">
                <Users className="w-6 h-6 text-white" />
              </div>

              {/* Glowing particles around trophy */}
              <div className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-cyan-400 rounded-full animate-ping"
                    style={{
                      left: `${20 + Math.cos((i * 45 * Math.PI) / 180) * 180}px`,
                      top: `${20 + Math.sin((i * 45 * Math.PI) / 180) * 180}px`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '2s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};