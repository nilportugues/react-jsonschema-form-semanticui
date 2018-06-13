/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
import React from "react";
import PropTypes from "prop-types";

import { asNumber } from "../../utils";
import { Dropdown } from "semantic-ui-react";
import { v4 as uuid4 } from "uuid";

function processValue({ type, items }, data) {
  if (data === "") {
    return undefined;
  } else if (
    type === "array" &&
    items &&
    ["number", "integer"].includes(items.type)
  ) {
    return data.map(asNumber);
  } else if (type === "boolean") {
    return data === "true";
  } else if (type === "number") {
    return asNumber(data);
  }
  return data;
}

function getValue(data, multiple) {
  if (multiple && data !== undefined && !(data.value instanceof Array)) {
    return [data.value];
  }

  return data.value;
}

function SelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readOnly,
    multiple,
    autoFocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
  } = props;
  const { enumOptions } = options;
  const dropdownOptions = [];

  enumOptions.map(({ value, label }, i) => {
    dropdownOptions.push({ key: i, value: value, text: label });
  });

  return (
    <Dropdown
      key={uuid4()}
      search
      selection
      placeholder={placeholder}
      options={dropdownOptions}
      multiple={multiple}
      defaultValue={value}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
      readOnly={readOnly}
      onBlur={
        onBlur &&
        ((event, self) => {
          const newValue = getValue(self, multiple);
          onBlur(id, processValue(schema, newValue));
        })
      }
      onFocus={
        onFocus &&
        ((event, self) => {
          const newValue = getValue(self, multiple);
          onFocus(id, processValue(schema, newValue));
        })
      }
      onChange={(event, self) => {
        const newValue = getValue(self, multiple);
        onChange(processValue(schema, newValue));
      }}
      onLabelClick={(event, self) => {
        const newValue = getValue(self, multiple);
        onChange(processValue(schema, newValue));
      }}
    />
  );
}

SelectWidget.defaultProps = {
  autoFocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    multiple: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default SelectWidget;
