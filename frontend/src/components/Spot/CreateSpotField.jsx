import { Error } from "../Error";
import "../../css/Error.css";
/**
 * @param {object} props
 * @param {App.CreateSpotFormLabel} props.propData
 * @returns {JSX.Element}
 */
export const CreateSpotField = ({ propData }) => {
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
    error2,
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
        {error2 && <Error errors={error2()} />}
      </label>
      {hrAfter && <hr />}
    </div>
  );
};
