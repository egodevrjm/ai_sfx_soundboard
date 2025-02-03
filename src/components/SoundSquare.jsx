import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Repeat, Square, Volume2, Timer, FastForward, Trash2 } from 'lucide-react';
import SoundModal from './SoundModal';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SoundSquare = ({ masterVolume = 1 }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [soundName, setSoundName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopInterval, setLoopInterval] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = volume * masterVolume;
    }
  }, [playbackRate, volume, masterVolume]);

  const generateSound = async (prompt) => {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: prompt })
      });
      
      if (!response.ok) throw new Error('Failed to generate sound');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setSoundName(prompt.slice(0, 20) + (prompt.length > 20 ? '...' : ''));
    } catch (err) {
      console.error('Error generating sound:', err);
      alert('Failed to generate sound. Please try again.');
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);

      if (loopInterval > 0) {
        loopTimeoutRef.current = setTimeout(() => {
          audioRef.current.currentTime = 0;
          handlePlay();
        }, loopInterval);
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    }
  };

  const handleClear = () => {
    handleStop();
    setAudioUrl(null);
    setSoundName('');
  };

  const handleClick = () => {
    if (audioUrl) {
      if (isPlaying) {
        handleStop();
      } else {
        handlePlay();
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleLoopIntervalChange = (value) => {
    setLoopInterval(value[0]);
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
  };

  const handleAudioEnd = () => {
    if (!isLooping && loopInterval === 0) {
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Card className="bg-gray-800 border-gray-700">
        <button
          onClick={handleClick}
          className={`w-full aspect-square rounded-lg transition-all duration-100 flex flex-col items-center justify-center gap-2
            ${audioUrl 
              ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
              : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'} 
            ${isPlaying ? 'scale-95' : 'scale-100'}
            min-h-[120px]`}
        >
          {audioUrl ? (
            <>
              {isPlaying ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
              {soundName && (
                <Badge variant="secondary" className="bg-black/30">
                  {soundName}
                </Badge>
              )}
            </>
          ) : (
            <Plus className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Control panel */}
        {audioUrl && showControls && (
          <div className="absolute bottom-full left-0 w-full bg-gray-800 rounded-t-lg p-3 shadow-lg mb-1 border border-gray-700">
            {/* Clear button */}
            <div className="flex justify-end mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Clear sound
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Loop controls */}
            <div className="flex items-center gap-2 mb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isLooping ? "default" : "secondary"}
                    size="icon"
                    onClick={toggleLoop}
                    className="h-6 w-6"
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Toggle loop
                </TooltipContent>
              </Tooltip>
              <div className="flex-1">
                <Slider
                  value={[loopInterval]}
                  onValueChange={handleLoopIntervalChange}
                  min={0}
                  max={5000}
                  step={100}
                />
              </div>
              <Timer className="w-4 h-4 text-gray-400" />
            </div>

            {/* Speed control */}
            <div className="flex items-center gap-2 mb-3">
              <FastForward className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <Slider
                  value={[playbackRate * 100]}
                  onValueChange={(value) => setPlaybackRate(value[0] / 100)}
                  min={50}
                  max={200}
                  step={10}
                />
              </div>
              <span className="text-xs text-gray-400 min-w-[2.5rem]">{playbackRate}x</span>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <Slider
                  value={[volume * 100]}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  min={0}
                  max={100}
                  step={10}
                />
              </div>
            </div>
          </div>
        )}

        {audioUrl && (
          <audio 
            ref={audioRef} 
            src={audioUrl}
            onEnded={handleAudioEnd}
            loop={isLooping}
          />
        )}
      </Card>

      <SoundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={generateSound}
      />
    </div>
  );
};

export default SoundSquare;