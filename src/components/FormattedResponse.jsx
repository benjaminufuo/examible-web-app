import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

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
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeSanitize, rehypeKatex]}
                components={{
                  code({ children, ...props }) {
                    return (
                      <code {...props}>
                        <Latex>{children}</Latex>
                      </code>
                    );
                  },
                }}
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
