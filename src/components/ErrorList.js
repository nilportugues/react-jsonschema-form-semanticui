import React from "react";
import { List, ListItem, Divider, Form, Message } from "semantic-ui-react";

export default function ErrorList(props) {
  const { errors } = props;
  return (
    <div>
      <Form error>
        <Message error>
          <div className="panel-heading">
            <h3 className="panel-title">Errors</h3>
          </div>
          <List bulleted>
            {errors.map((error, i) => {
              return (
                <ListItem key={i}>
                  <span className="error">{error.stack}</span>
                </ListItem>
              );
            })}
          </List>
        </Message>
      </Form>
      <Divider hidden />
    </div>
  );
}
