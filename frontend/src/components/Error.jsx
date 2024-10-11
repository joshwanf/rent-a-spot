import "../css/Error.css";

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
