import React from 'react';
import PropTypes from 'prop-types';

const Skills = (props) => {
  return (
    <div className="tomsah-skills tomsah-page-section">
      <div className="row reset-gutter-margin-mobile">
        <div className="col-xs-2 reset-gutter-padding-mobile">
          <h2 className="tomsah-section-title tomsah-section-title--small text-uppercase reset-margin">
            skills
          </h2>
        </div>
        <div className="col-xs-9 col-xs-push-1 col-md-push-0 reset-gutter-padding-mobile tomsah-skills__list">
          <p className="margin-reset">
            HTML / HTML5 <br />
            CSS / CSS3 / SCSS / PostCSS <br />
            JavaScript / ES6 / React / GreenSocks / jQuery <br />
            Bootstrap / Foundation <br />
            Drupal 7 &amp; 8 / Twig <br />
            Github / NPM / Webpack <br />
            Responsive Web Design / Mobile first <br />
            Cross-browser / cross-device / Accessibility &amp; usability <br />
          </p>
        </div>
      </div>
    </div>
  )
}

export default Skills;