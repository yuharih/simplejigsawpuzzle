import { useState } from 'react';
import ImageSelectionView from './components/ImageSelectionView';
import PlayView from './components/PlayView';
import { PuzzleImage, PuzzlePiece, PuzzleDifficulty } from './types';
import { PUZZLE_CONFIGS, createPuzzlePieces } from './utils/puzzleUtils';

type ViewType = 'selection' | 'play';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('selection');
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PuzzleDifficulty | null>(null);
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);

  const handleImageSelect = (image: PuzzleImage, difficulty: PuzzleDifficulty) => {
    setSelectedImage(image);
    setSelectedDifficulty(difficulty);
    const config = PUZZLE_CONFIGS[difficulty];
    const pieces = createPuzzlePieces(image.url, config.rows, config.cols);
    setPuzzlePieces(pieces);
    setCurrentView('play');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedImage(null);
    setSelectedDifficulty(null);
    setPuzzlePieces([]);
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {currentView === 'selection' && (
        <ImageSelectionView onImageSelect={handleImageSelect} />
      )}
      {currentView === 'play' && selectedImage && selectedDifficulty && (
        <PlayView
          image={selectedImage}
          difficulty={selectedDifficulty}
          pieces={puzzlePieces}
          setPieces={setPuzzlePieces}
          onBack={handleBackToSelection}
        />
      )}
      <footer style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.9)', padding: '10px 16px', fontSize: 12, display: 'flex', gap: 16, justifyContent: 'center' }}>
        <a href="/privacy.html" style={{ color: '#334155', textDecoration: 'underline' }}>プライバシーポリシー</a>
        <a href="/terms.html" style={{ color: '#334155', textDecoration: 'underline' }}>利用規約</a>
        <a href="/contact.html" style={{ color: '#334155', textDecoration: 'underline' }}>お問い合わせ</a>
        <a href="/faq.html" style={{ color: '#334155', textDecoration: 'underline' }}>FAQ</a>
      </footer>
    </div>
  );
}

export default App;

