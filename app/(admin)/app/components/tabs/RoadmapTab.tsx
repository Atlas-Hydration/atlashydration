'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'atlas_roadmap_state';

type Phase = 'completed' | 'in-progress' | 'planned';

interface RoadmapCard {
  id: string;
  title: string;
  desc: string;
  category: string;
  phase: Phase;
}

type BoardId = 'prelaunch' | 'phase1';

const tagClassMap: Record<Phase, string> = {
  completed: 'roadmap__tag--green',
  'in-progress': 'roadmap__tag--yellow',
  planned: 'roadmap__tag--blue',
};

const tagLabelMap: Record<Phase, string> = {
  completed: 'Done',
  'in-progress': 'In Progress',
  planned: 'Planned',
};

const INITIAL_CARDS: Record<BoardId, RoadmapCard[]> = {
  prelaunch: [
    { id: 'pl-1', title: 'Finalize Packaging Strategy', desc: 'Decide between pouches vs retail boxes for each product line', category: 'Packaging', phase: 'in-progress' },
    { id: 'pl-2', title: 'Confirm Pouch Configuration', desc: '16 sticks per pouch — primary DTC format for shipping efficiency and perceived value', category: 'Packaging', phase: 'in-progress' },
    { id: 'pl-3', title: 'Determine Retail Box Configuration', desc: 'Recommended: 10 sticks per box — aligns with industry norms, lower entry price point', category: 'Packaging', phase: 'in-progress' },
    { id: 'pl-4', title: 'Decide SKU Structure', desc: 'Grapefruit Pouch & Box, Strawberry Lemonade Pouch & Box — 4 core SKUs', category: 'Product', phase: 'in-progress' },
    { id: 'pl-5', title: 'File Trademark', desc: 'Enable Amazon Brand Registry for brand protection and enhanced listings', category: 'Legal', phase: 'planned' },
    { id: 'pl-6', title: 'Onboard to Amazon', desc: 'Set up Amazon seller account and prepare for marketplace launch', category: 'Distribution', phase: 'planned' },
    { id: 'pl-7', title: 'Estimate Packaging Costs', desc: 'Get production quotes for pouch + box formats across all SKUs', category: 'Finance', phase: 'planned' },
    { id: 'pl-8', title: 'Approve Packaging Production', desc: 'Final sign-off on designs, materials, and production run quantities', category: 'Packaging', phase: 'planned' },
  ],
  phase1: [
    { id: 'p1-1', title: 'Amazon Launch Preparation', desc: '30–50% of hydration revenue comes through Amazon at maturity. Set up listings, A+ content, and brand storefront.', category: 'Distribution', phase: 'planned' },
    { id: 'p1-2', title: 'Product Architecture & Packaging', desc: 'Dual packaging system: 16-stick pouches for DTC, 10-stick retail boxes for shelf presence. 4 core SKUs across Strawberry Lemonade & Grapefruit.', category: 'Product', phase: 'planned' },
    { id: 'p1-3', title: 'Direct-to-Consumer Growth', desc: 'Stronger landing page messaging, product bundles, customer reviews, UGC videos. Prioritize Shopify & TikTok Shop channels.', category: 'Growth', phase: 'planned' },
    { id: 'p1-4', title: 'UGC Content Engine', desc: 'Recruit creators producing authentic content around workouts, travel, morning routines, and athletic performance for TikTok advertising.', category: 'Marketing', phase: 'planned' },
    { id: 'p1-5', title: 'Community Positioning', desc: 'Establish Atlas as the hydration brand for people who move. Core communities: Travelers, Athletes (padel), Pilots.', category: 'Brand', phase: 'planned' },
  ],
};

function loadState(): Record<string, { phase: Phase; board: BoardId }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function applyState(
  cards: Record<BoardId, RoadmapCard[]>,
  state: Record<string, { phase: Phase; board: BoardId }>
): Record<BoardId, RoadmapCard[]> {
  if (!Object.keys(state).length) return cards;
  const result: Record<BoardId, RoadmapCard[]> = { prelaunch: [], phase1: [] };
  // place each card into its stored board/phase
  const allCards = [...cards.prelaunch, ...cards.phase1];
  allCards.forEach((card) => {
    const saved = state[card.id];
    if (saved && saved.board && saved.phase) {
      result[saved.board].push({ ...card, phase: saved.phase });
    } else {
      // determine original board
      const originalBoard: BoardId = INITIAL_CARDS.prelaunch.some((c) => c.id === card.id)
        ? 'prelaunch'
        : 'phase1';
      result[originalBoard].push(card);
    }
  });
  return result;
}

interface ColumnProps {
  phase: Phase;
  boardId: BoardId;
  cards: RoadmapCard[];
  onDrop: (cardId: string, targetPhase: Phase, targetBoardId: BoardId) => void;
}

function RoadmapColumn({ phase, boardId, cards, onDrop }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const phaseCards = cards.filter((c) => c.phase === phase);
  const headerClass =
    phase === 'completed'
      ? 'roadmap__column-header--completed'
      : phase === 'in-progress'
      ? 'roadmap__column-header--progress'
      : 'roadmap__column-header--planned';
  const dotColor =
    phase === 'completed' ? 'var(--green)' : phase === 'in-progress' ? 'var(--yellow)' : 'var(--accent)';
  const label =
    phase === 'completed' ? 'Completed' : phase === 'in-progress' ? 'In Progress' : 'Planned';

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    onDrop(cardId, phase, boardId);
    setIsDragOver(false);
  }

  return (
    <div
      className={`roadmap__column${isDragOver ? ' drag-over' : ''}`}
      data-phase={phase}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className={`roadmap__column-header ${headerClass}`}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="roadmap__column-dot" style={{ background: dotColor }} />
          {label}
        </span>
        <span className="roadmap__column-count">{phaseCards.length}</span>
      </div>
      {phaseCards.map((card) => (
        <DraggableCard key={card.id} card={card} />
      ))}
    </div>
  );
}

function DraggableCard({ card }: { card: RoadmapCard }) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
    // Store board info
    e.dataTransfer.setData('application/board', card.phase);
    setIsDragging(true);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  return (
    <div
      className={`roadmap__card${isDragging ? ' dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-id={card.id}
    >
      <div className="roadmap__card-title">{card.title}</div>
      <div className="roadmap__card-desc">{card.desc}</div>
      <div className="roadmap__card-meta">
        <span className={`roadmap__tag ${tagClassMap[card.phase]}`}>
          {tagLabelMap[card.phase]}
        </span>
        <span className="roadmap__tag roadmap__tag--cat">{card.category}</span>
      </div>
    </div>
  );
}

interface BoardProps {
  boardId: BoardId;
  cards: RoadmapCard[];
  onDrop: (cardId: string, targetPhase: Phase, targetBoardId: BoardId) => void;
}

function RoadmapBoard({ boardId, cards, onDrop }: BoardProps) {
  const phases: Phase[] = ['completed', 'in-progress', 'planned'];
  return (
    <div className="roadmap">
      {phases.map((phase) => (
        <RoadmapColumn
          key={phase}
          phase={phase}
          boardId={boardId}
          cards={cards}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}

export default function RoadmapTab() {
  const [boards, setBoards] = useState<Record<BoardId, RoadmapCard[]>>(() => {
    return applyState(INITIAL_CARDS, loadState());
  });

  // Touch drag support
  const touchCardRef = useRef<{ card: RoadmapCard; board: BoardId } | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);

  function saveBoards(newBoards: Record<BoardId, RoadmapCard[]>) {
    const state: Record<string, { phase: Phase; board: BoardId }> = {};
    (Object.keys(newBoards) as BoardId[]).forEach((boardId) => {
      newBoards[boardId].forEach((card) => {
        state[card.id] = { phase: card.phase, board: boardId };
      });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const handleDrop = useCallback(
    (cardId: string, targetPhase: Phase, targetBoardId: BoardId) => {
      setBoards((prev) => {
        let newPrelaunch = [...prev.prelaunch];
        let newPhase1 = [...prev.phase1];

        // Find source card and board
        let sourceBoard: BoardId | null = null;
        let cardIndex = -1;

        let idx = newPrelaunch.findIndex((c) => c.id === cardId);
        if (idx !== -1) { sourceBoard = 'prelaunch'; cardIndex = idx; }
        idx = newPhase1.findIndex((c) => c.id === cardId);
        if (idx !== -1) { sourceBoard = 'phase1'; cardIndex = idx; }

        if (!sourceBoard || cardIndex === -1) return prev;
        if (sourceBoard !== targetBoardId) return prev;

        let sourceArr = sourceBoard === 'prelaunch' ? newPrelaunch : newPhase1;
        const [card] = sourceArr.splice(cardIndex, 1);
        const updatedCard = { ...card, phase: targetPhase };

        if (targetBoardId === 'prelaunch') {
          newPrelaunch = sourceBoard === 'prelaunch' ? sourceArr : newPrelaunch;
          newPrelaunch.push(updatedCard);
        } else {
          newPhase1 = sourceBoard === 'phase1' ? sourceArr : newPhase1;
          newPhase1.push(updatedCard);
        }

        const newBoards = { prelaunch: newPrelaunch, phase1: newPhase1 };
        saveBoards(newBoards);
        return newBoards;
      });
    },
    []
  );

  return (
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">Operation Moon Landing</h2>
      </div>

      <div className="roadmap-mission">
        <div className="roadmap-mission__title">Mission</div>
        <div className="roadmap-mission__text">
          Build Atlas Hydration into a $100M+ premium hydration brand dominating the
          daily performance hydration category.
        </div>
        <div className="roadmap-mission__tags">
          <span className="roadmap-mission__tag">Premium Travel Hydration</span>
          <span className="roadmap-mission__tag">Performance Lifestyle</span>
          <span className="roadmap-mission__tag">Travelers</span>
          <span className="roadmap-mission__tag">Athletes</span>
          <span className="roadmap-mission__tag">Padel Players</span>
          <span className="roadmap-mission__tag">Pilots</span>
        </div>
      </div>

      <div className="roadmap-phase-label">
        Pre-Launch Phase &mdash; <span>Executive Decisions</span>
      </div>
      <RoadmapBoard
        boardId="prelaunch"
        cards={boards.prelaunch}
        onDrop={handleDrop}
      />

      <div className="roadmap-phase-label">
        Phase 1 &mdash; <span>Launchpad</span> &nbsp;&middot;&nbsp; $0 &rarr; $1M Revenue
      </div>
      <RoadmapBoard
        boardId="phase1"
        cards={boards.phase1}
        onDrop={handleDrop}
      />
    </div>
  );
}
