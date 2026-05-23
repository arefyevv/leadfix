type IssueCardProps = {
  title: string;
  text: string;
  priority: string;
  critical?: boolean;
};

export function IssueCard({ title, text, priority, critical = false }: IssueCardProps) {
  return (
    <article className={critical ? "insight-card insight-card--critical" : "insight-card"}>
      <div className="insight-card__top">
        <h4 className="insight-card__title">{title}</h4>
        <span className={critical ? "priority priority--critical" : "priority"}>{priority}</span>
      </div>
      <p className="insight-card__text">{text}</p>
    </article>
  );
}
