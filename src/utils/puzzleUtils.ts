import { PuzzlePiece, PuzzleConfig } from '../types';

export const PUZZLE_CONFIGS: Record<string, PuzzleConfig> = {
  test: {
    difficulty: 'test',
    rows: 2,
    cols: 2,
    totalPieces: 4,
    estimatedTime: '1分',
  },
  easy: {
    difficulty: 'easy',
    rows: 5,
    cols: 5,
    totalPieces: 25,
    estimatedTime: '10分',
  },
  normal: {
    difficulty: 'normal',
    rows: 7,
    cols: 7,
    totalPieces: 49,
    estimatedTime: '20分',
  },
};

export function createPuzzlePieces(
  imageUrl: string,
  rows: number,
  cols: number
): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = [];
  
  // 突起/凹みのマップを事前に生成（隣接するピース同士が噛み合うように）
  const tabMap: boolean[][] = [];
  for (let row = 0; row < rows; row++) {
    tabMap[row] = [];
    for (let col = 0; col < cols; col++) {
      // ランダムに突起か凹みかを決定（外枠以外）
      tabMap[row][col] = Math.random() < 0.5;
    }
  }
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `piece-${row}-${col}`;
      const isTopEdge = row === 0;
      const isRightEdge = col === cols - 1;
      const isBottomEdge = row === rows - 1;
      const isLeftEdge = col === 0;
      
      // 外枠はまっすぐ（null）、内側は隣接するピースと噛み合うように設定
      let topTab: boolean | null = null;
      let rightTab: boolean | null = null;
      let bottomTab: boolean | null = null;
      let leftTab: boolean | null = null;
      
      if (!isTopEdge) {
        // 上のピースと逆の形状（上のピースが突起なら凹み、凹みなら突起）
        topTab = !tabMap[row - 1][col];
      }
      
      if (!isRightEdge) {
        // 右のピースと噛み合う（自分が突起なら右は凹み、自分が凹みなら右は突起）
        rightTab = tabMap[row][col];
      }
      
      if (!isBottomEdge) {
        // 下のピースと逆の形状
        bottomTab = tabMap[row][col];
      }
      
      if (!isLeftEdge) {
        // 左のピースと逆の形状（左のピースが突起なら凹み、凹みなら突起）
        leftTab = !tabMap[row][col - 1];
      }
      
      pieces.push({
        id,
        row,
        col,
        imageUrl,
        x: col, // プレイゾーンでの正しい位置
        y: row,
        isPlaced: false,
        originalX: col,
        originalY: row,
        topTab,
        rightTab,
        bottomTab,
        leftTab,
      });
    }
  }
  
  // ランダムにシャッフル
  return shuffleArray(pieces);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function checkPuzzleComplete(pieces: PuzzlePiece[]): boolean {
  return pieces.every(piece => 
    piece.isPlaced && 
    piece.x === piece.originalX && 
    piece.y === piece.originalY
  );
}

export function getPieceImageStyle(
  piece: PuzzlePiece,
  rows: number,
  cols: number,
  containerWidth: number,
  containerHeight: number
): React.CSSProperties {
  const pieceWidth = containerWidth / cols;
  const pieceHeight = containerHeight / rows;
  const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.2; // 突起の深さ
  
  // 要素サイズを拡張（突起部分も含める）
  const expandedWidth = pieceWidth + tabDepth * 2;
  const expandedHeight = pieceHeight + tabDepth * 2;
  
  const clipPath = generateJigsawClipPath(piece, pieceWidth, pieceHeight, tabDepth);
  
  // 背景画像の位置を拡張分を考慮して調整
  const bgOffsetX = piece.originalX * pieceWidth;
  const bgOffsetY = piece.originalY * pieceHeight;
  
  return {
    backgroundImage: `url(${piece.imageUrl})`,
    backgroundSize: `${containerWidth}px ${containerHeight}px`,
    backgroundPosition: `-${bgOffsetX}px -${bgOffsetY}px`,
    backgroundRepeat: 'no-repeat',
    width: `${expandedWidth}px`,
    height: `${expandedHeight}px`,
    clipPath,
    WebkitClipPath: clipPath,
  };
}

// 手持ちピース用のスタイル（縮小表示、全体が見えるように調整）
export function getHandPieceImageStyle(
  piece: PuzzlePiece,
  rows: number,
  cols: number,
  containerWidth: number,
  containerHeight: number,
  scale: number = 0.6
): React.CSSProperties {
  const pieceWidth = containerWidth / cols;
  const pieceHeight = containerHeight / rows;
  const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.2;
  
  // 拡張されたサイズ
  const expandedWidth = pieceWidth + tabDepth * 2;
  const expandedHeight = pieceHeight + tabDepth * 2;
  
  // 縮小スケールを適用
  const scaledWidth = expandedWidth * scale;
  const scaledHeight = expandedHeight * scale;
  const scaledTabDepth = tabDepth * scale;
  
  // 縮小版のclip-pathを生成
  const clipPath = generateJigsawClipPath(piece, pieceWidth * scale, pieceHeight * scale, scaledTabDepth);
  
  // 背景画像の位置とサイズも縮小スケールに合わせて調整
  const bgOffsetX = piece.originalX * pieceWidth * scale;
  const bgOffsetY = piece.originalY * pieceHeight * scale;
  const bgSizeX = containerWidth * scale;
  const bgSizeY = containerHeight * scale;
  
  return {
    backgroundImage: `url(${piece.imageUrl})`,
    backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
    backgroundPosition: `-${bgOffsetX}px -${bgOffsetY}px`,
    backgroundRepeat: 'no-repeat',
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    clipPath,
    WebkitClipPath: clipPath,
  };
}

// ピースの配置オフセットを取得
export function getPiecePosition(
  piece: PuzzlePiece,
  rows: number,
  cols: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number } {
  const pieceWidth = containerWidth / cols;
  const pieceHeight = containerHeight / rows;
  const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.2;
  
  return {
    x: piece.x * pieceWidth - tabDepth,
    y: piece.y * pieceHeight - tabDepth,
  };
}

export function getGuideLineStyle(
  piece: PuzzlePiece,
  rows: number,
  cols: number,
  containerWidth: number,
  containerHeight: number
): React.CSSProperties {
  const pieceWidth = containerWidth / cols;
  const pieceHeight = containerHeight / rows;
  const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.2;
  
  const expandedWidth = pieceWidth + tabDepth * 2;
  const expandedHeight = pieceHeight + tabDepth * 2;
  
  const clipPath = generateJigsawClipPath(piece, pieceWidth, pieceHeight, tabDepth);
  
  return {
    width: `${expandedWidth}px`,
    height: `${expandedHeight}px`,
    clipPath,
    WebkitClipPath: clipPath,
    pointerEvents: 'none',
  };
}

function generateJigsawClipPath(
  piece: PuzzlePiece,
  width: number,
  height: number,
  tabDepth: number
): string {
  // 標準的なジグソーパズルの形状
  const tabWidth = tabDepth * 1.8; // 突起の幅
  const margin = 1; // ピース間の隙間
  
  let path = '';
  
  // 拡張された要素内での開始位置（tabDepth分内側）
  const startX = tabDepth + margin;
  const startY = tabDepth + margin;
  const endX = width + tabDepth - margin;
  const endY = height + tabDepth - margin;
  
  // 上辺
  const centerX = width / 2 + tabDepth;
  if (piece.topTab === null) {
    // まっすぐ（外枠）
    path += `M ${startX} ${startY} L ${endX} ${startY}`;
  } else if (piece.topTab) {
    // 突起
    const tabStart = centerX - tabWidth / 2;
    const tabEnd = centerX + tabWidth / 2;
    path += `M ${startX} ${startY} L ${tabStart} ${startY} `;
    path += `C ${tabStart + tabWidth * 0.2} ${startY}, ${tabStart + tabWidth * 0.4} ${startY - tabDepth * 0.5}, ${centerX} ${startY - tabDepth} `;
    path += `C ${tabEnd - tabWidth * 0.4} ${startY - tabDepth * 0.5}, ${tabEnd - tabWidth * 0.2} ${startY}, ${tabEnd} ${startY} `;
    path += `L ${endX} ${startY}`;
  } else {
    // 凹み
    const tabStart = centerX - tabWidth / 2;
    const tabEnd = centerX + tabWidth / 2;
    path += `M ${startX} ${startY} L ${tabStart} ${startY} `;
    path += `C ${tabStart + tabWidth * 0.2} ${startY}, ${tabStart + tabWidth * 0.4} ${startY + tabDepth * 0.5}, ${centerX} ${startY + tabDepth} `;
    path += `C ${tabEnd - tabWidth * 0.4} ${startY + tabDepth * 0.5}, ${tabEnd - tabWidth * 0.2} ${startY}, ${tabEnd} ${startY} `;
    path += `L ${endX} ${startY}`;
  }
  
  // 右辺
  const centerY = height / 2 + tabDepth;
  if (piece.rightTab === null) {
    path += ` L ${endX} ${endY}`;
  } else if (piece.rightTab) {
    const tabStart = centerY - tabWidth / 2;
    const tabEnd = centerY + tabWidth / 2;
    path += ` L ${endX} ${tabStart} `;
    path += `C ${endX} ${tabStart + tabWidth * 0.2}, ${endX + tabDepth * 0.5} ${tabStart + tabWidth * 0.4}, ${endX + tabDepth} ${centerY} `;
    path += `C ${endX + tabDepth * 0.5} ${tabEnd - tabWidth * 0.4}, ${endX} ${tabEnd - tabWidth * 0.2}, ${endX} ${tabEnd} `;
    path += ` L ${endX} ${endY}`;
  } else {
    const tabStart = centerY - tabWidth / 2;
    const tabEnd = centerY + tabWidth / 2;
    path += ` L ${endX} ${tabStart} `;
    path += `C ${endX} ${tabStart + tabWidth * 0.2}, ${endX - tabDepth * 0.5} ${tabStart + tabWidth * 0.4}, ${endX - tabDepth} ${centerY} `;
    path += `C ${endX - tabDepth * 0.5} ${tabEnd - tabWidth * 0.4}, ${endX} ${tabEnd - tabWidth * 0.2}, ${endX} ${tabEnd} `;
    path += ` L ${endX} ${endY}`;
  }
  
  // 下辺
  if (piece.bottomTab === null) {
    path += ` L ${startX} ${endY}`;
  } else if (piece.bottomTab) {
    const tabStart = centerX - tabWidth / 2;
    const tabEnd = centerX + tabWidth / 2;
    path += ` L ${endX} ${endY} L ${tabEnd} ${endY} `;
    path += `C ${tabEnd - tabWidth * 0.2} ${endY}, ${tabEnd - tabWidth * 0.4} ${endY + tabDepth * 0.5}, ${centerX} ${endY + tabDepth} `;
    path += `C ${tabStart + tabWidth * 0.4} ${endY + tabDepth * 0.5}, ${tabStart + tabWidth * 0.2} ${endY}, ${tabStart} ${endY} `;
    path += ` L ${startX} ${endY}`;
  } else {
    const tabStart = centerX - tabWidth / 2;
    const tabEnd = centerX + tabWidth / 2;
    path += ` L ${endX} ${endY} L ${tabEnd} ${endY} `;
    path += `C ${tabEnd - tabWidth * 0.2} ${endY}, ${tabEnd - tabWidth * 0.4} ${endY - tabDepth * 0.5}, ${centerX} ${endY - tabDepth} `;
    path += `C ${tabStart + tabWidth * 0.4} ${endY - tabDepth * 0.5}, ${tabStart + tabWidth * 0.2} ${endY}, ${tabStart} ${endY} `;
    path += ` L ${startX} ${endY}`;
  }
  
  // 左辺
  if (piece.leftTab === null) {
    path += ` Z`;
  } else if (piece.leftTab) {
    const tabStart = centerY - tabWidth / 2;
    const tabEnd = centerY + tabWidth / 2;
    path += ` L ${startX} ${endY} L ${startX} ${tabEnd} `;
    path += `C ${startX} ${tabEnd - tabWidth * 0.2}, ${startX - tabDepth * 0.5} ${tabEnd - tabWidth * 0.4}, ${startX - tabDepth} ${centerY} `;
    path += `C ${startX - tabDepth * 0.5} ${tabStart + tabWidth * 0.4}, ${startX} ${tabStart + tabWidth * 0.2}, ${startX} ${tabStart} `;
    path += ` Z`;
  } else {
    const tabStart = centerY - tabWidth / 2;
    const tabEnd = centerY + tabWidth / 2;
    path += ` L ${startX} ${endY} L ${startX} ${tabEnd} `;
    path += `C ${startX} ${tabEnd - tabWidth * 0.2}, ${startX + tabDepth * 0.5} ${tabEnd - tabWidth * 0.4}, ${startX + tabDepth} ${centerY} `;
    path += `C ${startX + tabDepth * 0.5} ${tabStart + tabWidth * 0.4}, ${startX} ${tabStart + tabWidth * 0.2}, ${startX} ${tabStart} `;
    path += ` Z`;
  }
  
  return `path("${path}")`;
}
