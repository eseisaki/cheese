/*  PARENT COMPONENT: App.js
 *  DESCRIPTION: Main page for user
 *
 *
 */
import React, { Component } from "react";
import Header from "./homepage/Header";
import PostHeader from "./homepage/PostHeader";
import queryString from "query-string";
/************************************************************************************************/
export class Homepage extends Component {
  render() {
    //Get username from url query
    let url = this.props.location.search;
    let params = queryString.parse(url);
    return (
      <div>
        <Header />
        <PostHeader queryUser={params} />
      </div>
    );
  }
}

export default Homepage;
