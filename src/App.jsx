import React, { useState } from 'react';
import { Settings, Volume2 } from 'lucide-react';
import SoundSquare from './components/SoundSquare';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function App() {
  const [masterVolume, setMasterVolume] = useState(1);
  const squares = Array.from({ length: 25 }); // 5x5 grid = 25 squares
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <Card className="max-w-4xl mx-auto bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">
              AI Sound Board
            </h1>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Master Volume Control */}
              <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
                <Volume2 className="w-5 h-5 text-gray-300" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  title="Master Volume"
                />
              </div>
              
              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Clear All Sounds
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export Board
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Import Board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Sound Grid - 5x5 grid */}
          <div className="grid grid-cols-5 gap-4">
            {squares.map((_, index) => (
              <SoundSquare 
                key={index}
                masterVolume={masterVolume}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;