import { Error } from "../Error";
import "../../css/Error.css";
/**
 * @param {object} props
 * @param {App.SpotFormLabel} props.propData
 * @returns {JSX.Element}
 */
export const SpotFormField = ({ propData }) => {
  const {
    heading,
    caption,
    fieldName,
    placeholder,
    value,
    onChangeHandler,
    isTextarea,
    inputType,
    hrAfter,
    error,
  } = propData;
  return (
    <div>
      <label>
        <strong>{heading}</strong>
        <br />
        {caption ? (
          <>
            {caption} <br />
          </>
        ) : (
          <></>
        )}
        {isTextarea === "textarea" ? (
          <textarea
            name={fieldName}
            placeholder={placeholder}
            value={value}
            onChange={onChangeHandler}
          />
        ) : (
          <input
            name={fieldName}
            type={inputType === "number" ? "number" : "text"}
            placeholder={placeholder}
            value={value}
            onChange={onChangeHandler}
          />
        )}
        {error && <Error errors={error} />}
      </label>
      {hrAfter && <hr />}
    </div>
  );
};
