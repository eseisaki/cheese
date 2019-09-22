/*  PARENT COMPONENT: HomePage.js
 *  DESCRIPTION:The mainbody of page which contains a gallery bar and displays
 *              images of the selected gallery.
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Gallery from "./mainbody/Gallery";
import Tab from "@material-ui/core/Tab";
import AddGalleryIcon from "@material-ui/icons/AddToPhotos";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import { galleries as get_galleries } from "../../axios/Get";
import { gallery as add_gallery } from "../../axios/Post";
import { gallery as delete_gallery } from "../../axios/Delete";
import { images } from "../../axios/Get";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  root: {
    marginTop: 20,
    marginLeft: "80px",
    marginRight: "80px"
  },
  button: {
    color: "#990033"
  },
  buttonIcon: { marginRight: 3 }
});
/************************************************************************************************/
export class MainBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleries: [],
      my_profile: null,
      is_stranger: null,
      index: 0,
      open_cg: false,
      new_gallery_title: ""
    };
  }
  /************************************************************************************************/
  /* FUNCTIONS */
  componentDidMount = () => {
    const queryUser = this.props.queryUser;

    let response = get_galleries(queryUser);

    response.then(value => {
      if (value === null) {
        this.setState({
          error: "This account is private.Follow this user first."
        });
      } else {
        this.setState({
          galleries: value.galleries,
          my_profile: value.my_profile,
          is_stranger: value.is_stranger
        });
        this.getImages(0);
      }
    });
  };

  selectGallery = (event, value) => {
    this.setState({ index: value });

    this.getImages(value);
    return <div />;
  };

  getImages = value => {
    const query = {
      username: this.props.queryUser["username"],
      gallery_title: this.state.galleries[value]
    };

    let response = images(query);
    response.then(value_res => {
      this.setState({ images: value_res });
    });
  };

  createGallery = event => {
    event.preventDefault();

    const payload = { gallery_title: this.state.new_gallery_title };

    let response = add_gallery(payload);
    response.then(value => {
      this.setState({ open_cg: false, galleries: value.galleries, index: 0 });
      this.getImages(this.state.index);
    });
  };

  deleteGallery = () => {
    const payload = { gallery_title: this.state.galleries[this.state.index] };
    let response = delete_gallery(payload);
    response.then(value => {
      this.setState({ galleries: value.galleries, index: 0 });
      this.getImages(this.state.index);
    });
  };

  /************************************************************************************************/
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              {/*Create new gallery button*/}
              {this.state.my_profile ? (
                <Button
                  variant="text"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    this.setState({ open_cg: true });
                  }}
                >
                  <AddGalleryIcon className={classes.addGalIcon} />
                  Create
                </Button>
              ) : null}
            </Grid>
            <Dialog
              open={this.state.open_cg}
              onClose={() => {
                this.setState({ open_cg: false });
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Creating new Gallery
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  id="gallery_title"
                  label="Title"
                  type="text"
                  inputProps={{ maxLength: 10 }}
                  required
                  fullWidth
                  onChange={event =>
                    this.setState({ new_gallery_title: event.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  onClick={event => this.createGallery(event)}
                  color="primary"
                >
                  Create
                </Button>
              </DialogActions>
            </Dialog>

            {/*Gallery name tags */}
            <Grid item xs={8}>
              <Tabs
                value={this.state.index}
                onChange={this.selectGallery}
                variant="scrollable"
                scrollButtons="auto"
                className={classes.tab}
              >
                {this.state.galleries.map(item => (
                  <Tab label={item} key={item} />
                ))}
              </Tabs>
            </Grid>

            {/*Delete a gallery button*/}
            {this.state.my_profile ? (
              <Grid item>
                <IconButton
                  className={classes.button}
                  onClick={this.deleteGallery}
                >
                  <DeleteIcon className={classes.buttonIcon} />
                </IconButton>
              </Grid>
            ) : null}
          </Grid>
        </AppBar>

        <TabContainer>
          {this.state.galleries[this.state.index] ? (
            <Gallery
              images={this.state.images}
              queryUser={this.props.queryUser}
              my_profile={this.state.my_profile}
              gallery_title={this.state.galleries[this.state.index]}
              gallery_num={this.state.galleries.length}
            />
          ) : null}
        </TabContainer>
      </div>
    );
  }
}

MainBody.propTypes = { queryUser: PropTypes.object.isRequired };

export default withStyles(styles)(MainBody);
