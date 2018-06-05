import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import TweenMax  from 'gsap';

import imageGlobe from '../images/globe.png';
//import imageGlobe from '../images/globe_texture.svg';
//import imageGlobe from '../images/globe.svg';

class Intro extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount () {
   this.introAnimation();
  }

  introAnimation = () => {
   var controller = new ScrollMagic.Controller();
   //pin the intro
   var pinIntroScene = new ScrollMagic.Scene({
     triggerElement: this.refs.title,
     triggerHook: 'onLeave',
     triggerHook: -0.2
   })
   .setPin(this.refs.intro, {pushFollowers: false})
   .addTo(controller);

   //pin the globe
   var pinIntroScene2 = new ScrollMagic.Scene({
     triggerElement: this.refs.title,
     triggerHook: 0,
     duration: '50%'
   })
   .setPin(this.refs.globe, {pushFollowers: false})
   .addTo(controller);

   //create a timeline
   var tlIntro= new TimelineMax();
     tlIntro
     .to(this.refs.intro, 0.3 , {autoAlpha: 0, ease: Power0.easeNone})
     .to(this.refs.globe, 0.8, {scale: 1.2, left:100 , top: 200, opacity:1, ease:Power2.easeInOut});

   //build a scene
   var ourScene = new ScrollMagic.Scene({
     triggerElement: this.refs.intro,
     triggerHook: 0.4,
     duration: '80%',  // the scene should last for a scroll distance of 100px
     offset: '30%'   // start this scene after scrolling for 50px
   })
   .setTween(tlIntro) // pins the element for the the scene's duration
   .addTo(controller); // assign the scene to the controller

  }

  render () {
    return (
      <div className="col-md-4 tomsah-intro">
        <h1 className="tomsah-intro__title text-uppercase" ref="title">hi</h1>

        <div className="row">
          <div className="col-md-10 col-md-offset-1">
             <div className="tomsah-intro__text" ref="intro">
              <p>
                I'm Thomas. French front-end developer and climber based in London.<br/>
                Currently on a one-year trip around the world.
              </p>
             </div>
          </div>
        </div>

         <div className="tomsah-globe" ref="globe">
            <img src={imageGlobe} alt="" ref="globeImg"/>
        </div>
      </div>
    )
  }
}

export default Intro;
