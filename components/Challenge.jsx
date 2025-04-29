import { useState } from 'react';
import entities from '../data/entities.json';
import traits from '../data/traits.json';

export default function Challenge() {
  const [challengeEntity, setChallengeEntity] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [result, setResult] = useState(null);
  const [seenEntities, setSeenEntities] = useState([]);
  const [openLayers, setOpenLayers] = useState({
    Physical: true,
    Functional: false,
    Abstract: false,
    Social: false,
  });
  const [showHints, setShowHints] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const startChallenge = () => {
    let remainingEntities = entities.filter(e => !seenEntities.includes(e.name));

    if (remainingEntities.length === 0) {
      remainingEntities = entities;
      setSeenEntities([]);
    }

    const randomIndex = Math.floor(Math.random() * remainingEntities.length);
    const nextEntity = remainingEntities[randomIndex];

    setChallengeEntity(nextEntity);
    setSelectedTraits([]);
    setResult(null);
    setShowHints(false);
    setHintUsed(false);
    setOpenLayers({ Physical: true, Functional: false, Abstract: false, Social: false });
    setSeenEntities(prev => [...prev, nextEntity.name]);
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

    const score = Math.max(0, 100 - (missedTraits.length * 5 + extraTraits.length * 5) - (hintUsed ? 10 : 0));

    setResult({ correctMatches, missedTraits, extraTraits, score });
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
    return traitsArray.length > 0 ? traitsArray.map(traitName => {
      const traitInfo = traits.find(t => t.name === traitName);
      const entityFeedback = challengeEntity?.feedback?.[traitName];
      return (
        <div key={traitName} style={{ marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
          <div style={{ fontWeight: 'bold' }}>{traitName}</div>
          {entityFeedback ? (
            <div style={{ fontSize: '0.75rem', color: '#4B5563', marginLeft: '1rem', fontStyle: 'italic' }}>
              "{entityFeedback}"
            </div>
          ) : traitInfo?.feedback ? (
            <div style={{ fontSize: '0.75rem', color: '#4B5563', marginLeft: '1rem', fontStyle: 'italic' }}>
              "{traitInfo.feedback}"
            </div>
          ) : null}
        </div>
      );
    }) : <div>None</div>;
  };

  const generateHexCode = () => {
    return traits.map(trait => (selectedTraits.includes(trait.name) ? '1' : '0')).join('').match(/.{1,4}/g)
      ?.map(nibble => parseInt(nibble, 2).toString(16).toUpperCase()).join('') || '';
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '28rem', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>UHT Trait Challenge</h1>

      {!challengeEntity && (
        <button onClick={startChallenge} style={{ backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
          Start New Challenge
        </button>
      )}

      {challengeEntity && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ maxHeight: '16rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <img
              src={challengeEntity.image}
              alt={challengeEntity.name}
              style={{ maxHeight: '16rem', width: 'auto', objectFit: 'contain' }}
              loading="lazy"
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>Traits required: {challengeEntity.traits.length}</p>
          <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>Selected Traits: {selectedTraits.length}</p>
          <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>Current Hex: {generateHexCode()}</p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>{challengeEntity.name}</h2>
          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', marginBottom: '1rem' }}>Select the traits you think apply:</p>

          <button
            onClick={() => !hintUsed && (setShowHints(true), setHintUsed(true))}
            style={{ marginBottom: '1rem', backgroundColor: hintUsed ? '#9CA3AF' : '#F59E0B', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
            disabled={hintUsed}
          >
            {hintUsed ? 'Hint Used' : 'Show Hints'}
          </button>

          {layerNames.map((layer) => (
            <div key={layer} style={{ width: '100%', marginBottom: '0.5rem' }}>
              <button
                onClick={() => toggleLayer(layer)}
                style={{ width: '100%', backgroundColor: '#E5E7EB', textAlign: 'left', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
              >
                {openLayers[layer] ? '▼' : '▶'} {layer} Layer {showHints && `(Needs ${countTraitsInLayer(layer)})`}
              </button>

              {openLayers[layer] && (
                <div style={{ borderLeft: '4px solid #60A5FA', paddingLeft: '1rem', marginTop: '0.5rem', maxHeight: '12rem', overflowY: 'auto' }}>
                  {traits.filter((trait, index) => getLayer(index) === layer).map((trait) => (
                    <div
                      key={trait.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: selectedTraits.includes(trait.name) ? '#BBF7D0' : 'transparent' }}
                    >
                      <img
                        src={trait.icon}
                        alt={trait.name}
                        style={{ height: '20px', width: 'auto', objectFit: 'contain' }}
                      />
                      <input
                        type="checkbox"
                        checked={selectedTraits.includes(trait.name)}
                        onChange={() => toggleTrait(trait.name)}
                        style={{ height: '16px', width: '16px' }}
                      />
                      <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trait.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button onClick={checkAnswer} style={{ marginTop: '1.5rem', backgroundColor: '#16A34A', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            Submit Answer
          </button>

          {result && (
            <div style={{ textAlign: 'left', width: '100%', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Results:</h3>
              <p style={{ marginBottom: '0.5rem' }}><strong>Score: {result.score}%</strong></p>
              <p style={{ marginTop: '0.5rem' }}><strong>Correct:</strong></p>
              <div style={{ color: '#15803D', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{formatTraitsList(result.correctMatches)}</div>
              <p style={{ marginTop: '1rem' }}><strong>Missed:</strong></p>
              <div style={{ color: '#DC2626', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{formatTraitsList(result.missedTraits)}</div>
              <p style={{ marginTop: '1rem' }}><strong>Extras:</strong></p>
              <div style={{ color: '#CA8A04', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{formatTraitsList(result.extraTraits)}</div>

              <button onClick={startChallenge} style={{ marginTop: '1.5rem', backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                Try Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
