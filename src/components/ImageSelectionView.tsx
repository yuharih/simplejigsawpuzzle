import { useState } from 'react';
import { PuzzleImage, PuzzleDifficulty } from '../types';
import { PUZZLE_CONFIGS } from '../utils/puzzleUtils';
import './ImageSelectionView.css';

// ベースパスを取得（GitHub Pages用）
const BASE_URL = import.meta.env.BASE_URL;

// 今日の画像: public/images/today/ に today1.jpg, today2.jpg, today3.jpg を配置してください
const TODAY_IMAGES: PuzzleImage[] = [
  { id: 'today-1', url: `${BASE_URL}images/today/today1.jpg`, name: '今日の画像1', isTodayImage: true },
  { id: 'today-2', url: `${BASE_URL}images/today/today2.jpg`, name: '今日の画像2', isTodayImage: true },
  { id: 'today-3', url: `${BASE_URL}images/today/today3.jpg`, name: '今日の画像3', isTodayImage: true },
];

const PUZZLE_IMAGES: PuzzleImage[] = [
  { id: '1', url: `${BASE_URL}images/puzzle1.jpg`, name: '画像1' },
  { id: '2', url: `${BASE_URL}images/puzzle2.jpg`, name: '画像2' },
  { id: '3', url: `${BASE_URL}images/puzzle3.jpg`, name: '画像3' },
];

interface ImageSelectionViewProps {
  onImageSelect: (image: PuzzleImage, difficulty: PuzzleDifficulty) => void;
}

function ImageSelectionView({ onImageSelect }: ImageSelectionViewProps) {
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleImageClick = (image: PuzzleImage) => {
    setSelectedImage(image);
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = (difficulty: PuzzleDifficulty) => {
    if (selectedImage) {
      onImageSelect(selectedImage, difficulty);
    }
    setShowDifficultyModal(false);
    setSelectedImage(null);
  };

  const handleCloseModal = () => {
    setShowDifficultyModal(false);
    setSelectedImage(null);
  };


  const renderImageCard = (image: PuzzleImage) => (
    <div
      key={image.id}
      className="image-card"
      onClick={() => handleImageClick(image)}
    >
      <div className="image-wrapper">
        <img 
          src={image.url} 
          alt={image.name} 
          className="image-preview"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="200"%3E%3Crect width="280" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E画像を読み込めませんでした%3C/text%3E%3C/svg%3E';
          }}
        />
        {image.isTodayImage && (
          <div className="today-badge">今日の画像</div>
        )}
      </div>
      <div className="image-name">{image.name}</div>
    </div>
  );

  return (
    <div className="image-selection-view">
      <h1 className="title">シンプルジグソーパズル</h1>
      <p className="subtitle">好きな画像を選んで、ジグソーパズルを楽しもう！</p>
      <div className="about-link-wrapper">
        <button className="about-link" onClick={() => setShowAboutModal(true)} aria-label="このサイトについて">
          このサイトについて
        </button>
      </div>
      
      <div className="image-grid">
        {TODAY_IMAGES.map(renderImageCard)}
        {PUZZLE_IMAGES.map(renderImageCard)}
      </div>

      {showDifficultyModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">ピース数を選択してください</h2>
            <div className="difficulty-options">
              <button
                className="difficulty-button"
                onClick={() => handleDifficultySelect('test')}
              >
                <div className="difficulty-name">テスト（2×2）</div>
                <div className="difficulty-info">
                  {PUZZLE_CONFIGS.test.totalPieces}ピース（約{PUZZLE_CONFIGS.test.estimatedTime}）
                </div>
                <div className="difficulty-desc">
                  {PUZZLE_CONFIGS.test.rows} × {PUZZLE_CONFIGS.test.cols}
                </div>
              </button>
              <button
                className="difficulty-button"
                onClick={() => handleDifficultySelect('easy')}
              >
                <div className="difficulty-name">簡単</div>
                <div className="difficulty-info">
                  {PUZZLE_CONFIGS.easy.totalPieces}ピース（約{PUZZLE_CONFIGS.easy.estimatedTime}）
                </div>
                <div className="difficulty-desc">
                  {PUZZLE_CONFIGS.easy.rows} × {PUZZLE_CONFIGS.easy.cols}
                </div>
              </button>
              <button
                className="difficulty-button"
                onClick={() => handleDifficultySelect('normal')}
              >
                <div className="difficulty-name">普通</div>
                <div className="difficulty-info">
                  {PUZZLE_CONFIGS.normal.totalPieces}ピース（約{PUZZLE_CONFIGS.normal.estimatedTime}）
                </div>
                <div className="difficulty-desc">
                  {PUZZLE_CONFIGS.normal.rows} × {PUZZLE_CONFIGS.normal.cols}
                </div>
              </button>
            </div>
            <button className="cancel-button" onClick={handleCloseModal}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">このサイトについて</h2>
            <p className="about-text">
              これは完全無料で遊んでいただけるジグソーパズルゲームのWebサイトです。パズルが好きな母に向けて作成しました。どなたでも遊んでください。サイト維持のために広告を貼っています。
            </p>
            <button className="cancel-button" onClick={() => setShowAboutModal(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageSelectionView;

