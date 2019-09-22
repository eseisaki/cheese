/*  PARENT COMPONENT: Homepage.js
 *  DESCRIPTION:Includes profile picture, edit profile choice
 *              and basic informations about user.
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import { public_profile } from "../../axios/Get";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import FriendIcon from "@material-ui/icons/PersonAdd";
import Button from "@material-ui/core/Button";
import PopupList from "./postheader/PopupList";
import Typography from "@material-ui/core/Typography";
import { profile_image, follow } from "../../axios/Post";
import UnfollowIcon from "@material-ui/icons/PersonAddDisabled";
import { follower } from "../../axios/Delete";
import LockIcon from "@material-ui/icons/Lock";
import MainBody from "./MainBody";
/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  profileImage: {
    display: "inline-block",
    width: "180px",
    height: "180px",
    margin: 20,
    marginBottom: 0,
    marginLeft: "80px"
  },
  avatar_button: {
    display: "inline-block",
    marginTop: -50,
    marginLeft: -200
  },
  follow_button: {
    width: "60px",
    height: "60px",
    marginTop: 80,
    backgroundColor: "#990033",
    "&:hover": { backgroundColor: "#660022" }
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  errorMsg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 80
  },
  lockicon: { marginRight: "10px", width: "50px", height: "50px" }
});
/************************************************************************************************/
export class PostHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      email: null,
      is_stranger: null,
      my_profile: null,
      followers: [],
      following: [],
      followers_num: null,
      following_num: null,
      reg_date: null,
      profileImage: null,
      following_open: false,
      followers_open: false,
      error: ""
    };
  }
  /************************************************************************************************/
  /* FUNCTIONS */

  componentDidMount = () => {
    const query = this.props.queryUser;
    let response = public_profile(query);

    response.then(value => {
      this.setState({
        username: value.username,
        email: value.email,
        is_stranger: value.is_stranger,
        my_profile: value.my_profile,
        followers: value.followers,
        following: value.following,
        followers_num: value.followers_num,
        following_num: value.following_num,
        reg_date: value.reg_date.toString().slice(5, 16),
        profileImage: value.profile_image,
        error: "This account is private.Follow this user first."
      });
    });
  };

  updateProfilePicture = event => {
    let data = new FormData();
    data.append("file", event.target.files[0]);

    let response = profile_image(data);
    response.then(value => {
      this.setState({
        profileImage: value.profile_image
      });
    });
    response.catch(error => {});
  };

  followUser = () => {
    const payload = { username: this.state.username };
    let response = follow(payload);

    response.then(value => {
      if (value !== null) {
        this.setState({
          is_stranger: false,
          followers_num: value.followers_num
        });
      }
    });
  };

  unfollowUser = () => {
    const payload = { username: this.state.username };
    let response = follower(payload);

    response.then(value => {
      if (value !== null) {
        this.setState({
          is_stranger: true,
          followers_num: value.followers_num
        });
      }
    });
  };

  /************************************************************************************************/

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container>
          {/*profile picture with edit icon */}
          <Grid item>
            <Avatar
              alt="avatar"
              src={this.state.profileImage}
              className={classes.profileImage}
            />
            {this.state.my_profile ? (
              <label htmlFor="upload-file-avatar">
                <input
                  id="upload-file-avatar"
                  type="file"
                  name="file"
                  onChange={this.updateProfilePicture}
                  style={{ display: "none" }}
                />
                <Fab
                  component="span"
                  color="default"
                  type="submit"
                  aria-label="update_avatar"
                  className={classes.avatar_button}
                >
                  <EditIcon style={{ marginLeft: 18, marginTop: 15 }} />
                </Fab>
              </label>
            ) : null}
          </Grid>

          {/*User name */}
          <Grid item>
            <h2>{this.state.username}</h2>

            {/*Followers modal */}
            <Button
              type="submit"
              onClick={() => this.setState({ followers_open: true })}
            >
              {this.state.followers_num} Followers
            </Button>

            <PopupList
              list={this.state.followers}
              title={"Your followers: "}
              open={this.state.followers_open}
              onClose={() => {
                this.setState({ followers_open: false, following_open: false });
              }}
            />
            <br />

            {/*Following modal */}
            <Button
              type="submit"
              onClick={() => this.setState({ following_open: true })}
            >
              {this.state.following_num} Following
            </Button>
            <PopupList
              list={this.state.following}
              title={"You are following: "}
              open={this.state.following_open}
              onClose={() => {
                this.setState({ followers_open: false, following_open: false });
              }}
            />

            <br />

            {/*Registration date */}
            <Typography variant="subtitle2">
              Member since: <br />
              <i>{this.state.reg_date}</i>
            </Typography>
          </Grid>

          {/*Follow button */}
          {this.state.is_stranger ? (
            <Grid item>
              <Fab
                color="primary"
                aria-label="follow"
                className={classes.follow_button}
                onClick={this.followUser}
              >
                <FriendIcon />
              </Fab>
            </Grid>
          ) : null}

          {/*UnFollow button */}
          {this.state.is_stranger === false &&
          this.state.my_profile === false ? (
            <Grid item>
              <Fab
                color="primary"
                aria-label="unfollow"
                className={classes.follow_button}
                onClick={this.unfollowUser}
              >
                <UnfollowIcon />
              </Fab>
            </Grid>
          ) : null}
        </Grid>

        {this.state.is_stranger ? (
          /*Private account message, if user is not following this person */
          <div className={classes.errorMsg}>
            <LockIcon className={classes.lockicon} />
            <h3>{this.state.error}</h3>
          </div>
        ) : (
          <MainBody queryUser={this.props.queryUser} />
        )}
      </div>
    );
  }
}

PostHeader.propTypes = { queryUser: PropTypes.object.isRequired };

export default withStyles(styles)(PostHeader);
