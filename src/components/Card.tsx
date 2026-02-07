type CardProps = {
  title: string;
  value: string;
};

const Card = ({ title, value }: CardProps) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default Card;
