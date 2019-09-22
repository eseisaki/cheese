/*  PARENT COMPONENT: Homepage.js
 *  DESCRIPTION: Header with logo and account,logout buttons (NOT responsive).
 *
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from "../images/fullogo.png";
import IconButton from "@material-ui/core/IconButton";
import FaceIcon from "@material-ui/icons/Face";
import ExitIcon from "@material-ui/icons/ExitToApp";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import { logout } from "../../axios/Get";
import { withRouter } from "react-router-dom";
import PopupList from "./postheader/PopupList";
import jwt from "jsonwebtoken";
import { users } from "../../axios/Get";
/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  root: { backgroundColor: "#990033" },
  imglogo: { width: 200, marginLeft: "80px" },
  buttons: { marginRight: "80px" },
  search: { marginTop: 5 }
});
/************************************************************************************************/
export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, users: [] };
  }
  /************************************************************************************************/
  /* FUNCTIONS */

  /*RETURNS: nothing
   *DESCRIPTION:  Informs the backend for logout and redirect to login page.
   *
   */
  handleLogout = () => {
    let response = logout();

    response.then(value => {
      if (value) {
        this.props.history.push("/");
      } else {
        alert("Server error");
      }
    });
  };
  /*RETURNS: nothing
   *DESCRIPTION:  Redirects to homepage of current user.
   *
   */
  handleGoToProfile = () => {
    var current_user = jwt.decode(localStorage.getItem("jwt_token"), {
      complete: true
    }).payload["identity"];

    this.props.history.push("/homepage?username=" + current_user);
    window.location.reload();
  };

  getAllUsers = () => {
    this.setState({ open: true });

    let response = users();
    response.then(value => {
      this.setState({ users: value });
    });
  };

  /************************************************************************************************/
  render() {
    const { classes } = this.props;
    return (
      <header>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Grid container justify="space-between">
              {/*container with cheese logo*/}
              <Grid item>
                <img src={logo} alt="logo" className={classes.imglogo} />
              </Grid>
              {/*container with account, logout buttons*/}
              <Grid item className={classes.buttons}>
                <IconButton
                  className={classes.search}
                  aria-label="menu"
                  color="inherit"
                  onClick={this.getAllUsers}
                >
                  <SearchIcon />
                </IconButton>

                <IconButton
                  aria-label="menu"
                  color="inherit"
                  onClick={this.handleGoToProfile}
                >
                  <FaceIcon />
                </IconButton>

                <IconButton
                  aria-label="menu"
                  color="inherit"
                  onClick={this.handleLogout}
                >
                  <ExitIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/*Users modal */}
        <PopupList
          list={this.state.users}
          title={"All users: "}
          open={this.state.open}
          onClose={() => {
            this.setState({ open: false });
          }}
        />
      </header>
    );
  }
}

export default withRouter(withStyles(styles)(Header));
