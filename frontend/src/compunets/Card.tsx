interface CardProps {
  img: string;
  title: string;
  paragraph: string;
}
function Card({ img, title, paragraph }: CardProps) {
  return (
    <>
      <div className="benefit-card">
        <img src={img} alt="" />
        <span className="heading-M">{title}</span>

        <p className="main-para">{paragraph}</p>
      </div>
    </>
  );
}
export default Card;
