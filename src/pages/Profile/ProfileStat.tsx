export default function ProfileStat({
  iconName,
  heading,
  paragraph,
}: {
  iconName: string;
  heading: string;
  paragraph: string;
}) {
  return (
    <div className="profile-stats__stat">
      <div className="profile-stats-stat__icon" style={{ backgroundImage: `url('src/assets/${iconName}.svg')` }}></div>
      <h2
        title={heading.length > 20 ? heading : ""}
        className={heading.length > 20 ? "profile-stats-stat__long-title" : ""}
      >
        {heading.slice(0, 20) + (heading.length > 20 ? "..." : "")}
      </h2>
      <p>{paragraph}</p>
    </div>
  );
}
