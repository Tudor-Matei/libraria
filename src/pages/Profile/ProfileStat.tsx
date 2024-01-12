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
      <h2>{heading}</h2>
      <p>{paragraph}</p>
    </div>
  );
}
