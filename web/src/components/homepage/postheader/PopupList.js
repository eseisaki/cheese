/*  PARENT COMPONENT: PostHeader.js
 *  DESCRIPTION:List with followers and users following.
 *
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/AccountCircleOutlined";
import CheckCircle from "@material-ui/icons/CheckCircleOutline";
import { withRouter } from "react-router-dom";
import blue from "@material-ui/core/colors/blue";
import Dialog from "@material-ui/core/Dialog";
/************************************************************************************************/
/* JSX-STYLE */
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
};
/************************************************************************************************/

export class PopupList extends Component {
  /************************************************************************************************/
  /* FUNCTIONS */
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = user => {
    this.props.history.push("/homepage?username=" + user);
    window.location.reload();
  };
  /************************************************************************************************/
  render() {
    const {
      classes,
      list,
      title,
      onClose,
      staticContext,
      ...other
    } = this.props;

    return (
      <Dialog
        className={classes.modal}
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <div>
          <List>
            {list.map(user => (
              <ListItem
                button
                onClick={() => this.handleListItemClick(user.username)}
                key={user.username}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.username} />
                <ListItemAvatar>
                  {!user.in_common ? <AddIcon /> : <CheckCircle />}
                </ListItemAvatar>
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

PopupList.propTypes = {
  list: PropTypes.array.isRequired
};

export default withRouter(withStyles(styles)(PopupList));
