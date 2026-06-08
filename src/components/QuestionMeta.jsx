import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const QuestionMeta = ({
  item,
  newItem = item,
  subheadingClassName = "",
  imageClassName = "",
}) => (
  <>
    {newItem.subheadingA && (
      <h2 className={subheadingClassName}>
        <Latex>{item.subheadingA}</Latex>
      </h2>
    )}
    {newItem.diagramUrlA && (
      <img
        src={item.diagramUrlA}
        alt="Diagram loading..."
        className={imageClassName}
      />
    )}
    {newItem.subheadingB && (
      <h3 className={subheadingClassName}>
        <Latex>{item.subheadingB}</Latex>
      </h3>
    )}
    {newItem.diagramUrlB && (
      <img
        src={item.diagramUrlB}
        alt="Diagram loading..."
        className={imageClassName}
      />
    )}
  </>
);

export default QuestionMeta;
