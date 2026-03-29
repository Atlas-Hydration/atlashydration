const items = [
  "1,769mg Electrolytes",
  "Vitamin C 90mg",
  "Vitamin B3 24mg",
  "Vitamin B5 12mg",
  "Vitamin B6 2mg",
  "Vitamin B12 8mcg",
  "L-Glutamine 1,000mg",
  "L-Taurine 200mg",
  "Zero Sugar",
  "25 Calories",
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
