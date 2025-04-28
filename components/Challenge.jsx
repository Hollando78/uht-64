import { useState } from 'react';
import entities from '../data/entities.json';
import traits from '../data/traits.json';

export default function Challenge() {
  const [challengeEntity, setChallengeEntity] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [result, setResult] = useState(null);
  const [openLayers, setOpenLayers] = useState({
    Physical: true,
    Functional: true,
    Abstract: true,
    Social: true,
  });

  const startChallenge = () => {
    const randomIndex = Math.floor(Math.random() * entities.length);
    setChallengeEntity(entities[randomIndex]);
    setSelectedTraits([]);
    setResult(null);
  };

  const toggleTrait = (traitName) => {
    setSelectedTraits(prev =>
      prev.includes(traitName) ? prev.filter(t => t !== traitName) : [...prev, traitName]
    );
  };

  const checkAnswer = () => {
    if (!challengeEntity) return;

    const correctSet = new Set(challengeEntity.traits);
    const userSet = new Set(selectedTraits);

    const correctMatches = [...userSet].filter(trait => correctSet.has(trait));
    const missedTraits = [...correctSet].filter(trait => !userSet.has(trait));
    const extraTraits = [...userSet].filter(trait => !correctSet.has(trait));

    setResult({ correctMatches, missedTraits, extraTraits });
  };

  const layerNames = ["Physical", "Functional", "Abstract", "Social"];

  const getLayer = (index) => {
    if (index >= 0 && index < 8) return "Physical";
    if (index >= 8 && index < 16) return "Functional";
    if (index >= 16 && index < 24) return "Abstract";
    return "Social";
  };

  const toggleLayer = (layer) => {
    setOpenLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold">UHT Trait Challenge</h1>

      {!challengeEntity && (
        <button onClick={startChallenge} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start New Challenge
        </button>
      )}

      {challengeEntity && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <img src={challengeEntity.image} alt={challengeEntity.name} className="w-48 h-48 object-contain mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{challengeEntity.name}</h2>
          <p className="text-sm mb-4 italic">Select the traits you think apply:</p>

          {/* Traits grouped into collapsible layers */}
          {layerNames.map((layer) => (
            <div key={layer} className="w-full mb-2">
              <button
                onClick={() => toggleLayer(layer)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-left font-bold py-2 px-4 rounded"
              >
                {openLayers[layer] ? '▼' : '▶'} {layer} Layer
              </button>

              {openLayers[layer] && (
                <div className="border-l-4 border-blue-400 pl-4 mt-2 space-y-2">
                  {traits.filter((trait, index) => getLayer(index) === layer).map((trait) => (
                    <label key={trait.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTraits.includes(trait.name)}
                        onChange={() => toggleTrait(trait.name)}
                      />
                      <span className="text-sm">{trait.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button onClick={checkAnswer} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Submit Answer
          </button>

          {result && (
            <div className="text-left w-full mt-6">
              <h3 className="text-xl font-semibold mb-2">Results:</h3>
              <p><strong>Correct:</strong> {result.correctMatches.length}</p>
              <p><strong>Missed:</strong> {result.missedTraits.length}</p>
              <p><strong>Extras:</strong> {result.extraTraits.length}</p>

              <div className="mt-2 space-y-2">
                <p className="text-green-700">✔ Correct Traits: {result.correctMatches.join(', ')}</p>
                <p className="text-red-700">❌ Missed Traits: {result.missedTraits.join(', ')}</p>
                <p className="text-yellow-700">⚠️ Extra Traits: {result.extraTraits.join(', ')}</p>
              </div>

              <button onClick={startChallenge} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Try Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
