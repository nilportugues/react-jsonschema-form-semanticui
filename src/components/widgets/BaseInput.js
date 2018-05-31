import React from "react";
import PropTypes from "prop-types";
import { Input } from "semantic-ui-react";

function BaseInput(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  const {
    value,
    readOnly,
    disabled,
    autoFocus,
    onBlur,
    onFocus,
    options,
    schema,
    formContext,
    registry,
    ...inputProps
  } = props;

  inputProps.type = options.inputType || inputProps.type || "text";

  //Remove labels to make it look just like Bootstrap.
  inputProps.label = null;

  const _onChange = ({ target: { value } }) => {
    return props.onChange(value === "" ? options.emptyValue : value);
  };

  return (
    <Input
      focus={autoFocus}
      disabled={disabled}
      readOnly={readOnly}
      value={value === null ? "" : value}
      {...inputProps}
      onChange={_onChange}
      onBlur={onBlur && ((event) => onBlur(inputProps.id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(inputProps.id, event.target.value))}
    />
  );
}

BaseInput.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readOnly: false,
  autoFocus: false,
};

if (process.env.NODE_ENV !== "production") {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default BaseInput;
