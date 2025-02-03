import React, { useState } from 'react';
import { Mic, Wand2, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const EXAMPLE_PROMPTS = [
  "A cheerful chime sound",
  "A deep bass drum hit",
  "A magical sparkle effect",
  "A robotic beep sequence",
];

const SoundModal = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      await onGenerate(prompt);
      setPrompt('');
      onClose();
    } catch (error) {
      console.error('Error generating sound:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Generate New Sound
          </DialogTitle>
          <DialogDescription>
            Describe the sound you want to generate using natural language.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A short cheerful melody with bells and chimes..."
            className="min-h-[100px] bg-gray-800 border-gray-700 focus:ring-blue-500"
          />

          {/* Example prompts */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Example prompts
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
               <Button
                key={example}
                type="button"
                variant="outline"
                className="text-left h-auto py-2 text-sm text-gray-200 hover:text-white border-gray-700"
                onClick={() => handleExampleClick(example)}
              >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <Alert className="bg-blue-900/20 border-blue-800">
            <AlertDescription className="text-sm text-blue-200">
              Try to be specific about the sound characteristics, duration, and mood you want to create.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Sound
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SoundModal;