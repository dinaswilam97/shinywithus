import { Icon } from "./Icons";

const ITEMS = [
  {
    icon: "check" as const,
    title: "ضمان الجودة",
    text: "منتجات أصلية 100% مع رقابة جودة شاملة",
  },
  {
    icon: "truck" as const,
    title: "شحن سريع",
    text: "توصيل لباب البيت في كل المحافظات",
  },
  {
    icon: "lock" as const,
    title: "دفع آمن",
    text: "أكتر من 10 وسائل دفع موثوقة",
  },
  {
    icon: "chat" as const,
    title: "دعم متواصل",
    text: "خدمة عملاء على مدار الساعة",
  },
];

export function TrustRow() {
  return (
    <div className="trust-row">
      {ITEMS.map((item) => (
        <div className="trust-item" key={item.title}>
          <div className="ic">
            <Icon name={item.icon} size={26} strokeWidth={1.5} />
          </div>
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
