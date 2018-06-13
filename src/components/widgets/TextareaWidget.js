import React from "react";
import PropTypes from "prop-types";
import { TextArea } from "semantic-ui-react";

function TextareaWidget(props) {
  const {
    id,
    options,
    placeholder,
    value,
    required,
    disabled,
    readOnly,
    autoFocus,
    onChange,
    onBlur,
    onFocus,
  } = props;
  const _onChange = ({ target: { value } }) => {
    return onChange(value === "" ? options.emptyValue : value);
  };
  return (
    <div>
      <TextArea
        as="textarea"
        id={id}
        value={typeof value === "undefined" ? "" : value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        rows={options.rows}
        onBlur={onBlur && (event => onBlur(id, event.target.value))}
        onFocus={onFocus && (event => onFocus(id, event.target.value))}
        onChange={_onChange}
      />
    </div>
  );
}

TextareaWidget.defaultProps = {
  autoFocus: false,
  options: {},
};

if (process.env.NODE_ENV !== "production") {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.number,
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default TextareaWidget;
