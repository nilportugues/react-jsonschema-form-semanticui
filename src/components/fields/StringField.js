import React from "react";
import PropTypes from "prop-types";

import {
  getWidget,
  getUiOptions,
  isSelect,
  optionsList,
  getDefaultRegistry,
} from "../../utils";

function StringField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readOnly,
    autoFocus,
    onChange,
    onBlur,
    onFocus,
    registry = getDefaultRegistry(),
  } = props;
  const { title, format } = schema;
  const { widgets, formContext } = registry;
  const enumOptions = isSelect(schema) && optionsList(schema);
  const defaultWidget = format || (enumOptions ? "select" : "text");
  const { widget = defaultWidget, placeholder = "", ...options } = getUiOptions(
    uiSchema
  );
  const Widget = getWidget(schema, widget, widgets);

  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      id={idSchema && idSchema.$id}
      label={title === undefined ? name : title}
      value={formData}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      formContext={formContext}
      autoFocus={autoFocus}
      registry={registry}
      placeholder={placeholder}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  StringField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    formData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
    formContext: PropTypes.object.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
  };
}

StringField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readOnly: false,
  autoFocus: false,
};

export default StringField;
