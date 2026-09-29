const items = [
  "Sodium",
  "Potassium",
  "Magnesium",
  "Chloride",
  "Vitamin C",
  "B Vitamins",
  "L-Glutamine",
  "L-Alanine",
];

function StripItems() {
  return (
    <>
      {items.map((item, i) => (
        <span key={i}>
          <span className="vitamin-strip__item">{item}</span>
          <span className="vitamin-strip__divider">&bull;</span>
        </span>
      ))}
    </>
  );
}

export default function VitaminStrip() {
  return (
    <div className="vitamin-strip" aria-label="Key nutrients">
      <div className="vitamin-strip__track">
        <StripItems />
        <StripItems />
      </div>
    </div>
  );
}
