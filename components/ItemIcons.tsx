import type { FC } from "react";

// A hand-drawn, single-style line-icon set for backpack items.
// One look: 24px grid, rounded strokes, currentColor (tinted by the parent).

type P = { className?: string };
const DEF = "h-7 w-7";

const Svg: FC<{ className?: string; children: React.ReactNode }> = ({
  className = DEF,
  children,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const Backpack: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M6 9a6 6 0 0 1 12 0v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
    <path d="M9 9a3 3 0 0 1 6 0" />
    <rect x="8.5" y="13" width="7" height="5.5" rx="1.5" />
    <path d="M12 13v2.5" />
  </Svg>
);

const Pencil: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M5 19.5l1-4L16 5.5l3 3L9 18.5l-4 1z" />
    <path d="M14 7.5l3 3" />
    <path d="M5 19.5l3-1" />
  </Svg>
);

const Pen: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M5 19l1.5-4.5 9-9 3 3-9 9L5 19z" />
    <path d="M13.5 7l3.5 3.5" />
    <path d="M11 9.5l-1 1" />
  </Svg>
);

const Book: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M7 4h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M9 4v15" />
    <path d="M12 8h3" />
  </Svg>
);

const Books: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="4" y="5" width="3.2" height="14" rx="0.6" />
    <rect x="8" y="5" width="3.2" height="14" rx="0.6" />
    <path d="M13 6.6l3-0.8 3.4 12.8-3 0.8z" />
    <path d="M4 9h3.2M8 9h3.2" />
  </Svg>
);

const Notebook: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="7" y="3" width="12" height="18" rx="1.5" />
    <path d="M11 7h5M11 11h5M11 15h5" />
    <path d="M5 5.5v2M5 11v2M5 16.5v2" />
    <path d="M7 5.5h0M7 11h0M7 16.5h0" />
  </Svg>
);

const Folder: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M4 7a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7z" />
  </Svg>
);

const Laptop: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="5" y="5" width="14" height="9" rx="1.2" />
    <path d="M3 18h18l-1.4-3H4.4L3 18z" />
  </Svg>
);

const Calculator: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="6" y="3" width="12" height="18" rx="2" />
    <rect x="8.5" y="5.5" width="7" height="3" rx="0.6" />
    <path d="M9 12h0M12 12h0M15 12h0M9 15h0M12 15h0M15 15h0M9 18h0M12 18h0M15 18h0" />
  </Svg>
);

const Ruler: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="9" width="18" height="6" rx="1" />
    <path d="M6 9v2.2M9 9v3M12 9v2.2M15 9v3M18 9v2.2" />
  </Svg>
);

const Scissors: FC<P> = ({ className }) => (
  <Svg className={className}>
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="6.5" cy="17.5" r="2.5" />
    <path d="M8.6 8.2L20 16M8.6 15.8L20 8" />
  </Svg>
);

const Paint: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M15 4.5l4.5 4.5-6.5 6.5-4.5-4.5z" />
    <path d="M8.5 11l-3.5 8 8-3.5" />
    <path d="M5 19l2.2-2.2" />
  </Svg>
);

const Water: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M10 2.5h4M10 2.5v2.2M14 2.5v2.2" />
    <path d="M9.5 6h5a1 1 0 0 1 1 1v12.5a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8.5 19.5V7a1 1 0 0 1 1-1z" />
    <path d="M8.5 11h7" />
  </Svg>
);

const Apple: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M12 8.5c1.4-2 6-1.2 6 3 0 4-3 8.5-5 8.5-.8 0-1-.5-1.6-.5s-.8.5-1.6.5c-2 0-5-4.5-5-8.5 0-4.2 4.6-5 6-3z" />
    <path d="M12 8.5V6" />
    <path d="M12 6c0-1.4 1.4-2.4 3-2" />
  </Svg>
);

const Sandwich: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M3 9l9-4 9 4-9 3-9-3z" />
    <path d="M5 12.5c0 1.8 14 1.8 14 0" />
    <path d="M5 12v2.2c0 1.8 14 1.8 14 0V12" />
  </Svg>
);

const Lunchbox: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="4" y="8" width="16" height="11" rx="2" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    <path d="M4 13h16" />
  </Svg>
);

const Shoe: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M3 16.5l1-5.5 3 1 2-2 3.5 3.5 5 1.5c1.2.4 1.5 1 1.5 2v.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    <path d="M7 12.5l1.2 2M10 14l1.2 2" />
  </Svg>
);

const Shirt: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M9 4l-5 3 2 3 2-1.2V20h8V8.8L18 10l2-3-5-3-1.5 2h-3z" />
    <path d="M9 4a3 3 0 0 0 6 0" />
  </Svg>
);

const Jacket: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M9 4l-5 3 2 3 2-1.2V20h8V8.8L18 10l2-3-5-3" />
    <path d="M12 5.5V20" />
    <path d="M9 4a3 3 0 0 0 6 0" />
  </Svg>
);

const Ball: FC<P> = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3v18" />
    <path d="M5.6 5.6a12 12 0 0 0 0 12.8M18.4 5.6a12 12 0 0 1 0 12.8" />
  </Svg>
);

const Music: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M9 18V6l9-2v10" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="16" cy="14" r="2" />
  </Svg>
);

const Headphones: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="13.5" width="4" height="6.5" rx="1.6" />
    <rect x="17" y="13.5" width="4" height="6.5" rx="1.6" />
  </Svg>
);

const Battery: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="8" width="16" height="8" rx="2" />
    <path d="M21 11v2" />
    <path d="M11 9.5l-2 3h2.4l-2 3" />
  </Svg>
);

const Key: FC<P> = ({ className }) => (
  <Svg className={className}>
    <circle cx="8" cy="8" r="3.5" />
    <path d="M10.5 10.5L20 20" />
    <path d="M16.5 16.5l2-2M14.5 14.5l2-2" />
  </Svg>
);

const IdCard: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M13 10h5M13 13h5M6 15.5h6" />
  </Svg>
);

const Glasses: FC<P> = ({ className }) => (
  <Svg className={className}>
    <circle cx="7" cy="13" r="3" />
    <circle cx="17" cy="13" r="3" />
    <path d="M10 12.5h4M4 11l1-2.5M20 11l-1-2.5" />
  </Svg>
);

const Document: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 15h6M9 18h3" />
  </Svg>
);

const Clipboard: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <rect x="9" y="2.5" width="6" height="3.2" rx="1" />
    <path d="M8 11h8M8 15h8" />
  </Svg>
);

const Umbrella: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M3 12a9 9 0 0 1 18 0H3z" />
    <path d="M12 3v9M12 18a2 2 0 0 0 4 0" />
  </Svg>
);

const Mask: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M4 9.5V13a8 4 0 0 0 16 0V9.5a8 3 0 0 0-16 0z" />
    <path d="M4 9.5L2.5 8M20 9.5L21.5 8" />
    <path d="M4 11h16M4 13h16" />
  </Svg>
);

const Flask: FC<P> = ({ className }) => (
  <Svg className={className}>
    <path d="M9 3h6M10 3v6l-5 9a1 1 0 0 0 1 1.5h12a1 1 0 0 0 1-1.5l-5-9V3" />
    <path d="M7.5 15h9" />
  </Svg>
);

const Tablet: FC<P> = ({ className }) => (
  <Svg className={className}>
    <rect x="6" y="3" width="12" height="18" rx="2" />
    <path d="M11 18h2" />
  </Svg>
);

// Registry — order is the picker order.
export const ITEM_ICONS: { id: string; label: string; Icon: FC<P> }[] = [
  { id: "backpack", label: "Backpack", Icon: Backpack },
  { id: "pencil", label: "Pencil", Icon: Pencil },
  { id: "pen", label: "Pen", Icon: Pen },
  { id: "book", label: "Book", Icon: Book },
  { id: "books", label: "Books", Icon: Books },
  { id: "notebook", label: "Notebook", Icon: Notebook },
  { id: "folder", label: "Folder", Icon: Folder },
  { id: "document", label: "Paper", Icon: Document },
  { id: "clipboard", label: "Clipboard", Icon: Clipboard },
  { id: "laptop", label: "Laptop", Icon: Laptop },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "calculator", label: "Calculator", Icon: Calculator },
  { id: "ruler", label: "Ruler", Icon: Ruler },
  { id: "scissors", label: "Scissors", Icon: Scissors },
  { id: "paint", label: "Art", Icon: Paint },
  { id: "flask", label: "Science", Icon: Flask },
  { id: "water", label: "Water bottle", Icon: Water },
  { id: "apple", label: "Apple", Icon: Apple },
  { id: "sandwich", label: "Lunch", Icon: Sandwich },
  { id: "lunchbox", label: "Lunchbox", Icon: Lunchbox },
  { id: "shoe", label: "Shoes", Icon: Shoe },
  { id: "shirt", label: "Shirt", Icon: Shirt },
  { id: "jacket", label: "Jacket", Icon: Jacket },
  { id: "ball", label: "Ball", Icon: Ball },
  { id: "music", label: "Music", Icon: Music },
  { id: "headphones", label: "Headphones", Icon: Headphones },
  { id: "battery", label: "Charger", Icon: Battery },
  { id: "key", label: "Keys", Icon: Key },
  { id: "idcard", label: "Bus pass", Icon: IdCard },
  { id: "glasses", label: "Glasses", Icon: Glasses },
  { id: "umbrella", label: "Umbrella", Icon: Umbrella },
  { id: "mask", label: "Mask", Icon: Mask },
];

const BY_ID = new Map(ITEM_ICONS.map((i) => [i.id, i.Icon]));

export function ItemIcon({ id, className }: { id: string; className?: string }) {
  const Icon = BY_ID.get(id) ?? Backpack;
  return <Icon className={className} />;
}

// Migrate older emoji-based items to icon ids.
export const EMOJI_TO_ICON: Record<string, string> = {
  "✏️": "pencil", "🖊️": "pen", "🖍️": "pencil", "📒": "notebook", "📓": "notebook",
  "📁": "folder", "🗂️": "folder", "📚": "books", "📖": "book", "📐": "ruler",
  "🧮": "calculator", "💻": "laptop", "🔋": "battery", "🎧": "headphones", "🎒": "backpack",
  "💧": "water", "🍎": "apple", "🥪": "sandwich", "🍱": "lunchbox", "👟": "shoe",
  "🩳": "shirt", "👕": "shirt", "🧥": "jacket", "🧢": "shirt", "🏀": "ball",
  "⚽": "ball", "🎺": "music", "🎻": "music", "🎨": "paint", "🔬": "flask",
  "🧪": "flask", "✂️": "scissors", "📏": "ruler", "📎": "folder", "🔑": "key",
  "🪪": "idcard", "😷": "mask", "🧴": "water", "☂️": "umbrella", "⌚": "idcard",
  "👓": "glasses", "📝": "document",
};
