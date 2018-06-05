import React from 'react';
import PropTypes from 'prop-types';

const Contact = (props) => {
  return (
    <div className="tomsah-contact tomsah-page-section">
      <div className="row reset-gutter-margin-mobile">
        <div className="col-xs-2 reset-gutter-padding-mobile">
          <h2 className="tomsah-section-title tomsah-section-title--small text-uppercase reset-margin">
            contact
          </h2>
        </div>
        <div className="col-xs-9 col-xs-push-1 col-md-push-0 reset-gutter-padding-mobile tomsah-contact__text">
          <p>
            I’m currently somewhere in the world but feel
            free to contact me at <br />
            <a href="#"> thomas.salah@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact;