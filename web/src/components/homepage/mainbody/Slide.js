/*  PARENT COMPONENT: ImageSlider.js
 *  DESCRIPTION:Each slide contains an image and each comments .
 *
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddCommentIcon from "@material-ui/icons/AddComment";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { comment as del_comment } from "../../../axios/Delete";
import { comment as add_comment } from "../../../axios/Post";
import { comments } from "../../../axios/Get";

/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  imagePart: {
    width: "530px",
    margin: "20px"
  },
  commentPart: {
    width: "530px",
    margin: "20px"
  }
});
/************************************************************************************************/
export class Slide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      newComment: ""
    };
  }
  /************************************************************************************************/
  /* FUNCTIONS */
  componentDidUpdate = prevProps => {
    if (this.props.image.id !== prevProps.image.id) {
      this.getComments();
    }
  };

  componentDidMount = () => {
    this.getComments();
  };

  getComments = () => {
    const payload = {
      image_id: this.props.image.id,
      username: this.props.queryUser["username"]
    };
    let response = comments(payload);
    response.then(value => {
      this.setState({ comments: value });
    });
  };

  addComment = event => {
    event.preventDefault();
    const payload = {
      image_id: this.props.image.id,
      text: this.state.newComment
    };
    let response = add_comment(payload);
    response.then(value => {
      let temp_comments = this.state.comments;
      temp_comments.push(value);
      this.setState({ comments: temp_comments });
    });
  };

  deleteComment = (id, index) => {
    var payload = { comment_id: id, image_id: this.props.image.id };
    let response = del_comment(payload);
    response.then(() => {
      const temp_comments = this.state.comments;
      temp_comments.splice(index, 1);
      this.setState({ comments: temp_comments });
    });
  };

  /************************************************************************************************/
  render() {
    const { classes, image } = this.props;
    return (
      <div>
        <Grid container justify="center" alignItems="stretch" spacing={0}>
          {/*Fist element of slide is an image*/}
          <Grid item>
            <img src={image.path} alt="slide" className={classes.imagePart} />
          </Grid>
          {/*Second element of slide is a list with comments realated to the image*/}
          <Grid item>
            <List className={classes.root}>
              {this.state.comments.map(comment => (
                <ListItem
                  alignItems="flex-start"
                  className={classes.commentPart}
                  key={comment.id}
                >
                  <Grid container justify="space-around">
                    <Grid item xs={11}>
                      {/*Comment's Author */}
                      <Typography
                        component="span"
                        variant="h6"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {comment.owner}
                      </Typography>
                      {/*Comment's Body */}
                      {"-  "}
                      {comment.text}
                    </Grid>
                    <Grid item xs={1}>
                      {/*Delete comment button */}
                      <IconButton
                        type="submit"
                        className={classes.deleteComm}
                        onClick={() =>
                          this.deleteComment(
                            comment.id,
                            this.state.comments.indexOf(comment)
                          )
                        }
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}

              {/*Add a new comment */}
              <ListItem button divider>
                <TextField
                  id="input-with-icon-grid"
                  fullWidth
                  label="Write a comment.."
                  onChange={event => {
                    this.setState({ newComment: event.target.value });
                  }}
                />
                <Button
                  type="submit"
                  variant="text"
                  autoFocus
                  onClick={this.addComment}
                >
                  <AddCommentIcon />
                </Button>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}
Slide.propTypes = {
  image: PropTypes.object.isRequired
};

export default withStyles(styles)(Slide);
