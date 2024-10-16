import "../css/Error.css";

/**
 *
 * @param {object} props
 * @param {object} props.errors
 * @returns
 */
export const Error = (props) => {
  const errors = Object.entries(props.errors);
  return (
    <div className="error-box">
      {errors.map(([type, message]) => (
        <p key={type} className="error">
          {message}
        </p>
      ))}
    </div>
  );
};
