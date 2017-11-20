import React from "react";
import PropTypes from "prop-types";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

function ColorWidget(props) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  const {
    value,
    //disabled,
    //autofocus,
    //onBlur,
    //onFocus,
    options,
    schema,
    formContext,
    registry,
    ...inputProps
  } = props;

  inputProps.type = "color";
  inputProps.label = null;

  const onChangeHandler = value => {
    const color = value.hex;
    return props.onChange(color === "" ? options.emptyValue : color);
  };

  return <SketchExample {...props} onChange={onChangeHandler} />;
}

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
  };

  constructor(props) {
    super(props);
    this.state.color = this.hexToRgbA(this.props.value);
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.props.onChange(color);
    this.setState({ color: color.rgb });
  };

  hexToRgbA = hex => {
    let c;

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");

      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");

      return {
        r: (c >> 16) & 255,
        g: (c >> 8) & 255,
        b: c & 255,
        a: 1,
        hex: hex,
      };
    }

    return {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
      hex: "#000",
    };
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(
            ${this.state.color.r}, 
            ${this.state.color.g}, 
            ${this.state.color.b},
            ${this.state.color.a})`,
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

ColorWidget.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  ColorWidget.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default ColorWidget;
