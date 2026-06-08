import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

const FormattedResponse = ({ response }) => {
  if (!response) {
    return null;
  }
  return (
    <div>
      <div className="chat-markdown">
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
          {response}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default FormattedResponse;
