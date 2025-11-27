import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const FormattedResponse = ({ response }) => {
  const lineBreakRes = response?.split("\n");
  return (
    <div>
      {lineBreakRes.map((item, index) => (
        <div key={index}>
          {item === "" ? (
            <br />
          ) : (
            <div key={index} className="chat-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {item}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormattedResponse;
