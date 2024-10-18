import "../css/Error.css";

/**
 * @param {object} props
 * @param {object | string | undefined} props.errors
 * @returns
 */
export const Error = (props) => {
  if (typeof props.errors === "string") {
    return <div className="error">{props.errors}</div>;
  } else if (typeof props.errors === "object") {
    const errors = Object.entries(props.errors);
    return (
      <div className="error">
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
