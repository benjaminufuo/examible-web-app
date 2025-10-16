const FormattedResponse = ({ response }) => {
  const lineBreakRes = response?.split("\n");
  return (
    <div>
      {lineBreakRes.map((item, index) => (
        <div key={index}>
          {item === "" ? (
            <br />
          ) : (
            <div key={index}>
              {item
                .split("**")
                .map((items, indexes) =>
                  (indexes / 2) % 1 ? (
                    <b dangerouslySetInnerHTML={{ __html: items }}></b>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: items }}></span>
                  )
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormattedResponse;
