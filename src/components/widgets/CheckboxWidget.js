import React from "react";
import PropTypes from "prop-types";
import DescriptionField from "../fields/DescriptionField.js";
import { Checkbox } from "semantic-ui-react";

function CheckboxWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    readOnly,
    label,
    autoFocus,
    onChange,
  } = props;
  return (
    <div className={`checkbox ${disabled || readOnly ? "disabled" : ""}`}>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}
      <Checkbox
        id={id}
        checked={typeof value === "undefined" ? false : value}
        required={required}
        disabled={disabled || readOnly}
        autoFocus={autoFocus}
        onChange={(event, data) => onChange(data.checked)}
        label={label}
      />
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autoFocus: false,
};

if (process.env.NODE_ENV !== "production") {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxWidget;
