/*  PARENT COMPONENT: Gallery.js
 *  DESCRIPTION:Image slider for user gallery.Each image includes comments.
 *
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "./Slide";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import ArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

/************************************************************************************************/
/* JSX-STYLE */
const styles = theme => ({
  rightArrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  leftArrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
/************************************************************************************************/
export class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }
  /************************************************************************************************/
  /* FUNCTIONS */

  componentDidMount = () => {
    this.setState({ slideIndex: this.props.index });
  };

  gotoPrevSlide = () => {
    let current = this.state.slideIndex;
    let last_slide = this.props.images.length - 1;
    if (current <= 0) {
      this.setState({ slideIndex: last_slide });
    } else {
      this.setState(prevState => ({ slideIndex: prevState.slideIndex - 1 }));
    }
  };

  gotoNextSlide = () => {
    let current = this.state.slideIndex;
    let last_slide = this.props.images.length - 1;
    if (current >= last_slide) {
      this.setState({ slideIndex: 0 });
    } else {
      this.setState(prevState => ({ slideIndex: prevState.slideIndex + 1 }));
    }
  };

  /************************************************************************************************/

  render() {
    const { classes, images } = this.props;
    return (
      <div>
        <Paper>
          <Grid container justify="space-between" alignItems="center">
            {/*Carousel's left arrow*/}
            <Grid item xs={1}>
              <IconButton
                className={classes.leftArrow}
                color="inherit"
                onClick={this.gotoPrevSlide}
              >
                <ArrowLeft />
              </IconButton>
            </Grid>
            {/*Carousel's slide*/}
            <Grid item xs={10}>
              <Slide
                image={images[this.state.slideIndex]}
                queryUser={this.props.queryUser}
              />
            </Grid>
            {/*Carousel's right arrow*/}
            <Grid item xs={1} className={classes.rightArrow}>
              <IconButton color="inherit" onClick={this.gotoNextSlide}>
                <ArrowRight />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ImageSlider.propTypes = {
  images: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired
};

export default withStyles(styles)(ImageSlider);
