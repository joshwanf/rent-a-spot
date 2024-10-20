import "../css/Error.css";

/**
 * @param {object} props
 * @param {object | string | undefined} props.errors
 * @param {string} [props.testId]
 * @returns
 */
export const Error = (props) => {
  //   console.log("error", { props });
  if (typeof props.errors === "string") {
    return (
      <div className="error" data-testid={props.testId || ""}>
        {props.errors}
      </div>
    );
  } else if (typeof props.errors === "object") {
    const errors = Object.entries(props.errors);
    return (
      <div className="error" data-testid={props.testId || ""}>
        {errors.map(([type, message]) => (
          <p key={type} className="error">
            {message}
          </p>
        ))}
      </div>
    );
  } else {
    return <div></div>;
  }
};
