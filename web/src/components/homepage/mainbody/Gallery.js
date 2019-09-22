/*  PARENT COMPONENT: MainBody.js
 *  DESCRIPTION:A grid which contains all images of the selected gallery.
 *
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";
import ImageSlider from "./ImageSlider";
import ClearBtn from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import { GridListTileBar } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import PropTypes from "prop-types";
import { image as add_image } from "../../../axios/Post";
import { image as delete_image } from "../../../axios/Delete";

/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  button_container: { width: "100%" },
  upload_button: {
    height: 280
  },
  input: { display: "none" },
  clearTile: {
    background: "transparent"
  },
  clearBtn: {
    color: "white"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
/************************************************************************************************/
export class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      open: false,
      slide: 0,
      my_profile: null
    };
  }
  /************************************************************************************************/
  componentDidUpdate = prevProps => {
    if (this.props.images !== prevProps.images) {
      this.setState({ images: this.props.images });
    }
  };

  addNewImage = event => {
    let data = new FormData();
    data.append("file", event.target.files[0]);

    const query = { gallery_title: this.props.gallery_title };
    let response = add_image(data, query);

    response.then(value => {
      const temp_images = this.state.images;
      temp_images.unshift(value);
      this.setState({ images: temp_images });
    });
  };

  deleteImage = (id, index) => {
    var payload = { image_id: id };
    let response = delete_image(payload);
    response.then(value => {
      if (value) {
        const temp_images = this.state.images;
        temp_images.splice(index, 1);
        this.setState({ images: temp_images });
      }
    });
  };

  /************************************************************************************************/
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridList cellHeight={280} cols={4}>
          {/* Create a new gallery button.*/}
          {this.props.my_profile === false ||
          this.props.gallery_num === 0 ? null : (
            <GridListTile key={"000"}>
              <div>
                <label
                  htmlFor="upload-file"
                  className={classes.button_container}
                >
                  <input
                    id="upload-file"
                    type="file"
                    name="file"
                    onChange={this.addNewImage}
                    className={classes.input}
                  />
                  <Button
                    component="span"
                    type="submit"
                    className={classes.upload_button}
                    fullWidth
                  >
                    <AddPhotoIcon style={{ fontSize: 90 }} />
                  </Button>
                </label>
              </div>
            </GridListTile>
          )}

          {/* Show all images of gallery in a grid.*/}
          {this.state.images.map(tile => (
            <GridListTile key={tile.path}>
              <img
                src={tile.path}
                alt={tile.path}
                onClick={() => {
                  this.setState({
                    open: true,
                    slide: this.state.images.indexOf(tile)
                  });
                }}
              />

              {/*Delete image button*/}
              {this.props.my_profile ? (
                <GridListTileBar
                  className={classes.clearTile}
                  actionIcon={
                    <IconButton
                      onClick={() =>
                        this.deleteImage(
                          tile.id,
                          this.state.images.indexOf(tile)
                        )
                      }
                    >
                      <ClearBtn className={classes.clearBtn} />
                    </IconButton>
                  }
                />
              ) : null}
            </GridListTile>
          ))}
        </GridList>

        {/*A slider in order to view each image seperately.*/}
        <Modal
          className={classes.modal}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        >
          <ImageSlider
            images={this.state.images}
            index={this.state.slide}
            queryUser={this.props.queryUser}
          />
        </Modal>
      </div>
    );
  }
}

Gallery.propTypes = {
  images: PropTypes.array,
  my_profile: PropTypes.bool
};

export default withStyles(styles)(Gallery);
