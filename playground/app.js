import React, { Component } from "react";
import { render } from "react-dom";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import {
  Icon,
  Grid,
  Container,
  Header,
  Divider,
  Button,
} from "semantic-ui-react";

import { shouldRender } from "../src/utils";
import { samples } from "./samples";
import Form from "../src";
import { v4 as uuid4 } from "uuid";

// Import a few CodeMirror themes; these are used to match alternative
// bootstrap ones.
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/eclipse.css";

const log = type => console.log.bind(console, type);
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const liveValidateSchema = { type: "boolean", title: "Live validation" };
const cmOptions = {
  theme: "default",
  height: "auto",
  viewportMargin: Infinity,
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2,
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2,
};

class GeoPosition extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  onChange(name) {
    return event => {
      this.setState({ [name]: parseFloat(event.target.value) });
      setImmediate(() => this.props.onChange(this.state));
    };
  }

  render() {
    const { lat, lon } = this.state;
    return (
      <Grid.Row className="geo">
        <h3>Hey, I'm a custom component</h3>
        <p>
          I'm registered as <code>geo</code> and referenced in
          <code>uiSchema</code> as the <code>ui:field</code> to use for this
          schema.
        </p>
        <Grid.Row>
          <div className="6">
            <label>Latitude</label>
            <input
              className="form-control"
              type="number"
              value={lat}
              step="0.00001"
              onChange={this.onChange("lat")}
            />
          </div>
          <div className="6">
            <label>Longitude</label>
            <input
              className="form-control"
              type="number"
              value={lon}
              step="0.00001"
              onChange={this.onChange("lon")}
            />
          </div>
        </Grid.Row>
      </Grid.Row>
    );
  }
}

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange = (editor, metadata, code) => {
    this.setState({ valid: true, code });
    setImmediate(() => {
      try {
        this.props.onChange(fromJson(this.state.code));
      } catch (err) {
        this.setState({ valid: false, code });
      }
    });
  };

  render() {
    const { title, theme } = this.props;
    //const icon = this.state.valid ? "ok" : "remove";
    const cls = this.state.valid ? "check" : "close";
    return (
      <div style={{ padding: "6px 0" }}>
        <Grid.Row key={uuid4()}>
          <Grid.Column key={uuid4()}>
            <Header attached="top" as="h5" block>
              <Icon name={cls} size={"small"} />
              {title}
            </Header>
            <div style={{ border: "1px solid #d4d4d5", borderTop: "0" }}>
              <CodeMirror
                key={uuid4()}
                value={this.state.code}
                onChange={this.onCodeChange}
                options={Object.assign({}, cmOptions, { theme })}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </div>
    );
  }
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <Container fluid>
        {Object.keys(samples).map((label, i) => {
          return (
            <Button
              basic
              key={i}
              role="presentation"
              className={this.state.current === label ? "active" : ""}
              onClick={this.onLabelClick(label)}>
              {label}
            </Button>
          );
        })}
      </Container>
    );
  }
}

class CopyLink extends Component {
  onCopyClick = event => {
    this.input.select();
    document.execCommand("copy");
  };

  render() {
    const { shareURL, onShare } = this.props;
    if (!shareURL) {
      return (
        <Button basic type="button" onClick={onShare}>
          Share
        </Button>
      );
    }
    return (
      <div>
        <input ref={input => (this.input = input)} defaultValue={shareURL} />
        <Button onClick={this.onCopyClick}>
          <Icon name="copy" />
        </Button>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, validate } = samples.Simple;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      editor: "default",
      theme: "default",
      liveValidate: true,
      shareURL: null,
    };
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load(samples.Simple);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate, ObjectFieldTemplate } = data;
    // force resetting form component instance
    this.setState({ form: false }, _ =>
      this.setState({
        ...data,
        form: true,
        ArrayFieldTemplate,
        ObjectFieldTemplate,
      })
    );
  };

  onSchemaEdited = schema => this.setState({ schema, shareURL: null });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema, shareURL: null });

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  onThemeSelected = (theme, { stylesheet, editor }) => {
    this.setState({ theme, editor: editor ? editor : "default" });
    setImmediate(() => {
      // Side effect!
      document.getElementById("theme").setAttribute("href", stylesheet);
    });
  };

  setLiveValidate = ({ formData }) => this.setState({ liveValidate: formData });

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  onShare = () => {
    const { formData, schema, uiSchema } = this.state;
    const {
      location: { origin, pathname },
    } = document;
    try {
      const hash = btoa(JSON.stringify({ formData, schema, uiSchema }));
      this.setState({ shareURL: `${origin}${pathname}#${hash}` });
    } catch (err) {
      this.setState({ shareURL: null });
    }
  };

  render() {
    const {
      schema,
      uiSchema,
      formData,
      liveValidate,
      validate,
      editor,
      ArrayFieldTemplate,
      ObjectFieldTemplate,
      transformErrors,
    } = this.state;

    return (
      <Container fluid style={{ padding: "24px" }}>
        <Header as="h1">react-jsonschema-form-semanticui</Header>

        <Grid columns={16}>
          <Grid.Row>
            <Grid.Column width={12}>
              <Selector onSelected={this.load} />
            </Grid.Column>

            <Grid.Column width={4}>
              <Form schema={liveValidateSchema} formData={liveValidate}>
                <div>&nbsp;</div>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider />

        <Grid columns={16}>
          <Grid.Column width={10}>
            <Grid.Row>
              <Grid.Column width={10}>
                <Editor
                  title="JSONSchema"
                  theme={editor}
                  code={toJson(schema)}
                  onChange={this.onSchemaEdited}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Editor
                      title="UISchema"
                      theme={editor}
                      code={toJson(uiSchema)}
                      onChange={this.onUISchemaEdited}
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Editor
                      title="formData"
                      theme={editor}
                      code={toJson(formData)}
                      onChange={this.onFormDataEdited}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column width={6}>
            {this.state.form && (
              <Form
                ArrayFieldTemplate={ArrayFieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                liveValidate={liveValidate}
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={this.onFormDataChange}
                onSubmit={({ formData }) =>
                  console.log("submitted formData", formData)
                }
                fields={{ geo: GeoPosition }}
                validate={validate}
                onBlur={(id, value) =>
                  console.log(`Touched ${id} with value ${value}`)
                }
                onFocus={(id, value) =>
                  console.log(`Focused ${id} with value ${value}`)
                }
                transformErrors={transformErrors}
                onError={log("errors")}>
                <Grid>
                  <Grid.Column width={4}>
                    <Button primary type="submit">
                      Submit
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <CopyLink
                      shareURL={this.state.shareURL}
                      onShare={this.onShare}
                    />
                  </Grid.Column>
                </Grid>
              </Form>
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

render(<App />, document.getElementById("app"));
