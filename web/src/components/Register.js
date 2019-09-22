/*  PARENT COMPONENT: App.js
 *  DESCRIPTION: Register page for users.Sends user credentials to backend and saves response token.
 *
 *
 */

import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import cheese from "./images/cheese.png";
import { register } from "../axios/Post";

/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing() * 2}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`
  },
  avatar: {
    margin: theme.spacing(),
    width: 200,
    height: 120,
    backgroundColor: "#fffff"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(),
    color: "#990033"
  },
  submit: {
    marginTop: theme.spacing(3),
    color: "#ffffff",
    background: "#990033",
    "&:hover": { backgroundColor: "#660022" }
  },
  csslabel: { "&$cssfocused": { color: "#990033" } },
  cssfocused: {},
  cssunderline: { "&:after": { borderBottomColor: "#990033" } },
  register: {
    marginTop: theme.spacing(),
    color: "#990033"
  }
});
/************************************************************************************************/
export class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      username: "",
      password: "",
      retype_password: "",
      alert_open: false
    };
  }

  /************************************************************************************************/
  /* FUNCTIONS */

  /*RETURNS: nothing
   *DESCRIPTION:  By clicking submit button client sends register credentials to
   *              server and saves given token from response to local storage
   */
  handleClick = event => {
    event.preventDefault();

    if (this.state.password === this.state.retype_password) {
      var payload = {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password
      };

      let response = register(payload);

      response.then(value => {
        if (value) {
          this.props.history.push("/homepage?username=" + payload.username);
        } else {
          this.setState({ alert_open: true });
        }
      });
    }
  };
  /************************************************************************************************/
  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          {/*Cheese logo*/}
          <img alt="avatar" src={cheese} className={classes.avatar} />
          <Typography variant="subtitle1" color="textSecondary">
            Sign up to share photos with your friends.
          </Typography>
          <form className={classes.form}>
            {/*Request email*/}
            <FormControl margin="normal" required fullWidth>
              <InputLabel
                classes={{
                  root: classes.csslabel,
                  focused: classes.cssfocused
                }}
              >
                Email address
              </InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                onChange={event => this.setState({ email: event.target.value })}
                classes={{ underline: classes.cssunderline }}
              />
            </FormControl>
            {/*Request username*/}
            <FormControl margin="normal" required fullWidth>
              <InputLabel
                classes={{
                  root: classes.csslabel,
                  focused: classes.cssfocused
                }}
              >
                Username
              </InputLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                onChange={event =>
                  this.setState({ username: event.target.value })
                }
                classes={{ underline: classes.cssunderline }}
              />
            </FormControl>
            {/*Request password*/}
            <FormControl margin="normal" required fullWidth>
              <InputLabel
                classes={{
                  root: classes.csslabel,
                  focused: classes.cssfocused
                }}
              >
                Password
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                classes={{ underline: classes.cssunderline }}
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
              />
            </FormControl>
            {/*Retype password*/}
            <FormControl margin="normal" required fullWidth>
              <InputLabel
                classes={{
                  root: classes.csslabel,
                  focused: classes.cssfocused
                }}
              >
                Retype Password
              </InputLabel>
              <Input
                name="retype"
                type="password"
                id="retype"
                autoComplete="current-password"
                onChange={event =>
                  this.setState({ retype_password: event.target.value })
                }
                classes={{ underline: classes.cssunderline }}
              />
            </FormControl>
            {/*Submit button for register credentials*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={this.handleClick}
            >
              Sign up
            </Button>
          </form>
        </Paper>

        {/*Option to redirect to login*/}
        <Paper className={classes.paper}>
          <Typography variant="subtitle2" component="h3">
            Already Registered?
          </Typography>
          <Button
            type="submit"
            className={classes.register}
            onClick={event => {
              this.props.history.push("/");
            }}
          >
            Login
          </Button>
        </Paper>

        {/*Custom alert box for register errors*/}
        <Dialog
          open={this.state.alert_open}
          onClose={() => this.setState({ alert_open: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Oups, something went wrong."}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Credentials do not match. Make sure they are <b>correct</b> or try
              login.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ alert_open: false })}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    );
  }
}

export default withStyles(styles)(Register);
