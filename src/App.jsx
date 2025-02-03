import React, { useState, useRef } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
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
  const [squares, setSquares] = useState(Array(25).fill(null));
  const fileInputRef = useRef(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  
  // Function to handle clearing all sounds
  const handleClearAll = () => {
    setSquares(Array(25).fill(null));
  };

  // Function to export board configuration
  const handleExport = () => {
    const boardConfig = {
      squares: squares.map(square => square ? {
        prompt: square.prompt,
        soundName: square.soundName
      } : null),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(boardConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soundboard-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle importing board configuration
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          if (config.squares) {
            setSquares(config.squares);
          }
        } catch (error) {
          console.error('Error importing configuration:', error);
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to trigger file input click
  const triggerImport = () => {
    fileInputRef.current?.click();
  };

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
                  <DropdownMenuItem onClick={() => setIsApiKeyModalOpen(true)}>
                    Set API Key
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.reload()}>
                    Clear All Sounds
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={handleExport}>
                    Export Board
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={triggerImport}>
                    Import Board
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden file input for import */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
          {/* Sound Grid - 5x5 grid */}
          <div className="grid grid-cols-5 gap-4">
            {squares.map((squareData, index) => (
              <SoundSquare 
                key={index}
                masterVolume={masterVolume}
                data={squareData}
                onUpdate={(newData) => {
                  const newSquares = [...squares];
                  newSquares[index] = newData;
                  setSquares(newSquares);
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <ApiKeyInput 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}

export default App;