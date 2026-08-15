const MESSAGES = [
  "خصم 10% على الطلبات فوق 2000 جنيه — كود SHINY10",
  "خصم 12% على الطلبات فوق 4000 جنيه — كود SHINY12",
  "خصم 15% على الطلبات فوق 7500 جنيه — كود SHINY15",
];

export function AnnouncementBar() {
  return (
    <div className="announce" role="region" aria-label="عروض">
      <div className="announce-track">
        {MESSAGES.map((msg) => (
          <span key={msg}>{msg}</span>
        ))}
      </div>
    </div>
  );
}
