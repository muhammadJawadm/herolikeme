import React from 'react';
import { MicIcon, PlayIcon } from '../Icons';

interface VoiceMessageSectionProps {
  audioUrl: string | undefined;
}

const VoiceMessageSection: React.FC<VoiceMessageSectionProps> = ({ audioUrl }) => {
  if (!audioUrl) {
    return null;
  }

  const handlePlayPause = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Voice Message</h3>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
          <MicIcon />
        </div>
        <div className="flex-grow">
          <p className="text-gray-700">Voice message available</p>
          <div className="mt-2">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        <button
          onClick={handlePlayPause}
          className="ml-4 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          <PlayIcon />
        </button>
      </div>
    </div>
  );
};

export default VoiceMessageSection;
