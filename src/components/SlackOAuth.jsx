import React from "react";
import PropTypes from "prop-types";

function SlackOAuth({ oauthEndpoint, buttonText }) {
  const connectSlack = () => {
    window.location.href = oauthEndpoint;
  };

  return (
    <div className="slack-oauth">
      <h1>Connect Slack</h1>
      <button onClick={connectSlack}>{buttonText}</button>
    </div>
  );
}

SlackOAuth.propTypes = {
  oauthEndpoint: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onError: PropTypes.func,
};

SlackOAuth.defaultProps = {
  buttonText: "Connect Slack",
  onError: null,
};

export default SlackOAuth;
