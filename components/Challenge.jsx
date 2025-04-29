import { useState } from 'react';
import entities from '../data/entities.json';
import traits from '../data/traits.json';

export default function Challenge() {
  const [challengeEntity, setChallengeEntity] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [result, setResult] = useState(null);
  const [openLayers, setOpenLayers] = useState({
    Physical: true,
    Functional: false,
    Abstract: false,
    Social: false,
  });
  const [showHints, setShowHints] = useState(false);

  const startChallenge = () => {
    const randomIndex = Math.floor(Math.random() * entities.length);
    setChallengeEntity(entities[randomIndex]);
    setSelectedTraits([]);
    setResult(null);
    setShowHints(false);
    setOpenLayers({ Physical: true, Functional: false, Abstract: false, Social: false });
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
    setOpenLayers({ Physical: false, Functional: false, Abstract: false, Social: false });
  };

  const layerNames = ["Physical", "Functional", "Abstract", "Social"];

  const getLayer = (index) => {
    if (index >= 0 && index < 8) return "Physical";
    if (index >= 8 && index < 16) return "Functional";
    if (index >= 16 && index < 24) return "Abstract";
    return "Social";
  };

  const countTraitsInLayer = (layer) => {
    return challengeEntity ? challengeEntity.traits.filter(traitName => {
      const traitIndex = traits.findIndex(trait => trait.name === traitName);
      return getLayer(traitIndex) === layer;
    }).length : 0;
  };

  const toggleLayer = (layer) => {
    setOpenLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const formatTraitsList = (traitsArray) => {
    return traitsArray.length > 0 ? traitsArray.map(trait => (<div key={trait}>{trait}</div>)) : <div>None</div>;
  };

  const generateHexCode = () => {
    return traits.map(trait => (selectedTraits.includes(trait.name) ? '1' : '0')).join('').match(/.{1,4}/g)
      ?.map(nibble => parseInt(nibble, 2).toString(16).toUpperCase()).join('') || '';
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">UHT Trait Challenge</h1>

      {!challengeEntity && (
        <button onClick={startChallenge} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start New Challenge
        </button>
      )}

      {challengeEntity && (
        <div className="w-full flex flex-col items-center">
          <div className="w-32 h-32 overflow-hidden flex items-center justify-center mb-2 rounded shadow">
            <img
              src={challengeEntity.image}
              alt={challengeEntity.name}
              width="128"
              height="128"
              className="w-32 h-32 object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-gray-600">Traits required: {challengeEntity.traits.length}</p>
          <p className="text-xs text-gray-600">Selected Traits: {selectedTraits.length}</p>
          <p className="text-xs text-gray-600">Current Hex: {generateHexCode()}</p>

          <h2 className="text-xl font-semibold mb-2 text-center">{challengeEntity.name}</h2>
          <p className="text-xs mb-4 italic text-center">Select the traits you think apply:</p>

          <button
            onClick={() => setShowHints(!showHints)}
            className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>

          {layerNames.map((layer) => (
            <div key={layer} className="w-full mb-2">
              <button
                onClick={() => toggleLayer(layer)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-left font-bold py-2 px-4 rounded"
              >
                {openLayers[layer] ? '▼' : '▶'} {layer} Layer {showHints && `(Needs ${countTraitsInLayer(layer)})`}
              </button>

              {openLayers[layer] && (
                <div className="border-l-4 border-blue-400 pl-4 mt-2 max-h-48 overflow-y-auto space-y-1">
                  {traits.filter((trait, index) => getLayer(index) === layer).map((trait) => (
                    <div
                      key={trait.id}
                      className={`flex items-center space-x-2 p-1 rounded ${selectedTraits.includes(trait.name) ? 'bg-green-200' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTraits.includes(trait.name)}
                        onChange={() => toggleTrait(trait.name)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm truncate">{trait.name}</span>
                    </div>
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
              <h3 className="text-lg font-semibold mb-2">Results:</h3>
              <p><strong>Correct:</strong></p>
              <div className="text-green-700 ml-4 space-y-1">{formatTraitsList(result.correctMatches)}</div>
              <p className="mt-2"><strong>Missed:</strong></p>
              <div className="text-red-700 ml-4 space-y-1">{formatTraitsList(result.missedTraits)}</div>
              <p className="mt-2"><strong>Extras:</strong></p>
              <div className="text-yellow-700 ml-4 space-y-1">{formatTraitsList(result.extraTraits)}</div>

              <button onClick={startChallenge} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Try Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
