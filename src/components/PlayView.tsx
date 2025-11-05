import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PuzzleImage, PuzzlePiece, PuzzleDifficulty } from '../types';
import { PUZZLE_CONFIGS, checkPuzzleComplete, getPieceImageStyle, getGuideLineStyle, getPiecePosition, getHandPieceImageStyle } from '../utils/puzzleUtils';
import './PlayView.css';

interface PlayViewProps {
  image: PuzzleImage;
  difficulty: PuzzleDifficulty;
  pieces: PuzzlePiece[];
  setPieces: React.Dispatch<React.SetStateAction<PuzzlePiece[]>>;
  onBack: () => void;
}

function PlayView({ image, difficulty, pieces, setPieces, onBack }: PlayViewProps) {
  const [draggingPiece, setDraggingPiece] = useState<PuzzlePiece | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snappedPieceId, setSnappedPieceId] = useState<string | null>(null);
  const playZoneRef = useRef<HTMLDivElement>(null);
  const handZoneRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

  const config = PUZZLE_CONFIGS[difficulty];
  const PLAY_ZONE_MAX = 600;
  const HAND_ZONE_HEIGHT = 200;

  useEffect(() => {
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const PLAY_ZONE_SIZE = useMemo(() => {
    const horizontalPadding = 40; // コンテナ左右余白の概算
    const headerHeight = 120; // ヘッダー分の概算
    const handArea = HAND_ZONE_HEIGHT + 40; // 手持ちゾーン + 余白
    const usableW = Math.max(0, viewport.w - horizontalPadding);
    const usableH = Math.max(0, viewport.h - headerHeight - handArea);
    const size = Math.min(PLAY_ZONE_MAX, Math.min(usableW, usableH));
    return Math.max(280, size);
  }, [viewport, HAND_ZONE_HEIGHT]);

  const handlePiecePointerDown = (piece: PuzzlePiece, e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingPiece(piece);
    setMousePos({ x: e.clientX, y: e.clientY });
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  };

  const handlePointerMove = useCallback((e: PointerEvent, currentDraggingPiece: PuzzlePiece, currentPieces: PuzzlePiece[]) => {
    e.preventDefault();
    setMousePos({ x: e.clientX, y: e.clientY });

    const playZoneRect = playZoneRef.current?.getBoundingClientRect();
    if (!playZoneRect) return;

    // プレイゾーン外の場合は配置解除
    if (
      e.clientX < playZoneRect.left ||
      e.clientX > playZoneRect.right ||
      e.clientY < playZoneRect.top ||
      e.clientY > playZoneRect.bottom
    ) {
      setPieces(prev => prev.map(p => 
        p.id === currentDraggingPiece.id 
          ? { ...p, isPlaced: false, x: currentDraggingPiece.originalX, y: currentDraggingPiece.originalY }
          : p
      ));
      return;
    }

    const mouseX = e.clientX - playZoneRect.left;
    const mouseY = e.clientY - playZoneRect.top;

    const pieceWidth = PLAY_ZONE_SIZE / config.cols;
    const pieceHeight = PLAY_ZONE_SIZE / config.rows;

    // スナップ範囲内かチェック
    const snapThreshold = pieceWidth * 0.4;
    let snappedCol = -1;
    let snappedRow = -1;

    // プレイゾーン内の正しい位置を計算
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const targetX = col * pieceWidth + pieceWidth / 2;
        const targetY = row * pieceHeight + pieceHeight / 2;
        
        if (
          Math.abs(mouseX - targetX) < snapThreshold &&
          Math.abs(mouseY - targetY) < snapThreshold
        ) {
          // その位置が空いているかチェック
          const existingPiece = currentPieces.find(
            p => p.isPlaced && p.x === col && p.y === row && p.id !== currentDraggingPiece.id
          );
          if (!existingPiece) {
            snappedCol = col;
            snappedRow = row;
            break;
          }
        }
      }
      if (snappedCol !== -1) break;
    }

    if (snappedCol !== -1 && snappedRow !== -1) {
      setPieces(prev => prev.map(p => 
        p.id === currentDraggingPiece.id 
          ? { ...p, x: snappedCol, y: snappedRow, isPlaced: true }
          : p
      ));
    }
  }, [config, setPieces]);

  const handlePointerUp = useCallback((currentDraggingPiece: PuzzlePiece) => {
    // 正しい位置に配置されたか最終チェック
    setPieces(prev => {
      const piece = prev.find(p => p.id === currentDraggingPiece.id);
      if (!piece) {
        setDraggingPiece(null);
        return prev;
      }
      
      const isCorrectPosition = piece.x === piece.originalX && piece.y === piece.originalY;
      
      const updatedPieces = prev.map(p => {
        if (p.id === currentDraggingPiece.id) {
          // 正しい位置ならそのまま保持、間違っていたら配置解除
          if (isCorrectPosition && p.isPlaced) {
            // 正しい位置に配置された - スナップ演出を開始
            setSnappedPieceId(p.id);
            setTimeout(() => setSnappedPieceId(null), 500);
            return { ...p, isPlaced: true };
          } else if (p.isPlaced && !isCorrectPosition) {
            // 間違った位置に配置されたので解除
            return { ...p, isPlaced: false, x: p.originalX, y: p.originalY };
          }
          // プレイゾーン外の場合はそのまま
          return p;
        }
        return p;
      });

      return updatedPieces;
    });
    setDraggingPiece(null);
  }, [setPieces]);

  // ピースが配置された後に完成チェックを行う（ドラッグが完了した後のみ）
  useEffect(() => {
    // ドラッグ中でない場合のみ完成チェックを実行
    if (!draggingPiece && checkPuzzleComplete(pieces)) {
      setIsComplete(true);
    }
  }, [pieces, draggingPiece]);

  useEffect(() => {
    if (draggingPiece) {
      const handleMove = (e: PointerEvent) => {
        handlePointerMove(e, draggingPiece, pieces);
      };
      const handleUp = () => {
        handlePointerUp(draggingPiece);
      };
      
      window.addEventListener('pointermove', handleMove, { passive: false });
      window.addEventListener('pointerup', handleUp, { passive: true });
      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
    }
  }, [draggingPiece, pieces, handlePointerMove, handlePointerUp]);

  const placedPieces = pieces.filter(p => p.isPlaced);
  const handPieces = pieces.filter(p => !p.isPlaced);

  return (
    <div className="play-view">
      <div className="play-header">
        <button className="back-button" onClick={() => setShowConfirmDialog(true)}>
          ← 戻る
        </button>
        <h2 className="play-title">{image.name}</h2>
        <div className="play-header-right">
          <button className="preview-button" onClick={() => setShowPreview(true)}>
            📷 完成図を見る
          </button>
          <div className="play-info">
            {config.totalPieces}ピース / 配置済み: {placedPieces.length}
          </div>
        </div>
      </div>

      <div className="play-container">
        <div 
          ref={playZoneRef}
          className="play-zone"
          style={{ width: PLAY_ZONE_SIZE, height: PLAY_ZONE_SIZE }}
        >
          {/* ガイド線の表示 */}
          {pieces.map((piece) => {
            const isOccupied = pieces.some(p => p.isPlaced && p.x === piece.originalX && p.y === piece.originalY);
            if (isOccupied) return null;

            const pos = getPiecePosition(
              { ...piece, x: piece.originalX, y: piece.originalY },
              config.rows,
              config.cols,
              PLAY_ZONE_SIZE,
              PLAY_ZONE_SIZE
            );

            return (
              <div
                key={`guide-${piece.id}`}
                className="puzzle-guide"
                style={{
                  ...getGuideLineStyle(piece, config.rows, config.cols, PLAY_ZONE_SIZE, PLAY_ZONE_SIZE),
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                }}
              />
            );
          })}

          {/* 配置されたピース */}
          {pieces.map((piece) => {
            if (!piece.isPlaced) return null;
            
            const isCorrect = piece.x === piece.originalX && piece.y === piece.originalY;
            const pos = getPiecePosition(piece, config.rows, config.cols, PLAY_ZONE_SIZE, PLAY_ZONE_SIZE);

            return (
              <div
                key={piece.id}
                className={`puzzle-piece ${isCorrect ? 'correct' : ''} ${snappedPieceId === piece.id ? 'snap-success' : ''}`}
                style={{
                  ...getPieceImageStyle(piece, config.rows, config.cols, PLAY_ZONE_SIZE, PLAY_ZONE_SIZE),
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  cursor: draggingPiece?.id === piece.id ? 'grabbing' : 'grab',
                  opacity: isCorrect ? 1 : 0.7,
                  zIndex: 2,
                }}
                onPointerDown={(e) => handlePiecePointerDown(piece, e)}
              />
            );
          })}
        </div>

        <div ref={handZoneRef} className="hand-zone" style={{ height: HAND_ZONE_HEIGHT }}>
          <div className="hand-zone-title">手持ちのピース</div>
          <div className="hand-pieces-container">
            {handPieces.map((piece, index) => {
              const pieceWidth = PLAY_ZONE_SIZE / config.cols;
              const pieceHeight = PLAY_ZONE_SIZE / config.rows;
              const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.2;
              const expandedWidth = pieceWidth + tabDepth * 2;
              const scale = 0.6;
              const scaledWidth = expandedWidth * scale;

              return (
                <div
                  key={piece.id}
                  className="puzzle-piece hand-piece"
                  style={{
                    ...getHandPieceImageStyle(piece, config.rows, config.cols, PLAY_ZONE_SIZE, PLAY_ZONE_SIZE, scale),
                    cursor: draggingPiece?.id === piece.id ? 'grabbing' : 'grab',
                    position: 'absolute',
                    left: `${index * (scaledWidth + 10)}px`,
                    top: '20px',
                  }}
                  onPointerDown={(e) => handlePiecePointerDown(piece, e)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {draggingPiece && (
        <div
          className="puzzle-piece dragging-piece"
          style={{
            ...getPieceImageStyle(draggingPiece, config.rows, config.cols, PLAY_ZONE_SIZE, PLAY_ZONE_SIZE),
            position: 'fixed',
            left: `${mousePos.x - dragOffset.x}px`,
            top: `${mousePos.y - dragOffset.y}px`,
            pointerEvents: 'none',
            zIndex: 3000,
            opacity: 0.95,
            transform: 'scale(1.1)',
          }}
        />
      )}

      {showConfirmDialog && (
        <div className="confirm-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="confirm-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="confirm-title">プレイを終了して戻りますか？</h2>
            <p className="confirm-message">進行状況は保存されません</p>
            <div className="confirm-buttons">
              <button className="confirm-button confirm-cancel" onClick={() => setShowConfirmDialog(false)}>
                いいえ
              </button>
              <button className="confirm-button confirm-ok" onClick={onBack}>
                はい
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h2 className="preview-title">完成図</h2>
              <button className="preview-close-button" onClick={() => setShowPreview(false)}>
                ✕
              </button>
            </div>
            <div 
              className="preview-image-container"
              style={{
                width: `${PLAY_ZONE_SIZE}px`,
                height: `${PLAY_ZONE_SIZE}px`,
              }}
            >
              <img 
                src={image.url} 
                alt={image.name} 
                className="preview-image"
                style={{
                  width: `${PLAY_ZONE_SIZE}px`,
                  height: `${PLAY_ZONE_SIZE}px`,
                  objectFit: 'cover',
                }}
              />
            </div>
            <button className="preview-close-bottom-button" onClick={() => setShowPreview(false)}>
              閉じる
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="completion-overlay">
          <div className="completion-content">
            <div className="completion-icon">🎉</div>
            <h2 className="completion-title">完成しました！</h2>
            <p className="completion-message">おめでとうございます！</p>
            <button className="completion-button" onClick={onBack}>
              画像選択に戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayView;

