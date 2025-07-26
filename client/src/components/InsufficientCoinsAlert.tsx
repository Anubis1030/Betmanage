import React from 'react';
import { AlertCircle, Coins } from 'lucide-react';

interface InsufficientCoinsAlertProps {
  className?: string;
  currentBalance: number | null;
  requiredAmount: number;
}

export const InsufficientCoinsAlert: React.FC<InsufficientCoinsAlertProps> = ({ 
  className = '', 
  currentBalance, 
  requiredAmount 
}) => {
  const shortfall = currentBalance !== null ? requiredAmount - currentBalance : 0;
  
  return (
    <div className={`bg-destructive/10 text-destructive p-4 rounded-lg shadow-lg border border-destructive/30 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="bg-destructive/20 p-2 rounded-full">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg flex items-center">
            Insufficient Coins
            <Coins className="ml-2 h-4 w-4" />
          </h3>
          <p className="text-sm opacity-90 mb-2">You don't have enough coins for this bet</p>
          
          <div className="grid grid-cols-2 gap-2 text-sm bg-background/50 p-2 rounded-md">
            <div>
              <span className="text-muted-foreground">Your Balance:</span>
              <div className="font-medium">{currentBalance?.toLocaleString() || 0} coins</div>
            </div>
            <div>
              <span className="text-muted-foreground">Required:</span>
              <div className="font-medium">{requiredAmount.toLocaleString()} coins</div>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Shortfall:</span>
              <div className="font-bold text-destructive">{shortfall.toLocaleString()} coins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};