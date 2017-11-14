import React from "react";
import PropTypes from "prop-types";
import { Header } from "semantic-ui-react";

const REQUIRED_FIELD_SYMBOL = "*";

function TitleField(props) {
  const { id, title, required } = props;
  const legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return <Header id={id}>{legend}</Header>;
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
