import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import "debug.addIndicators";
import TweenMax  from 'gsap';
import GlobeCanvas from '../GlobeCanvas';
//import Globe from '../Globe';

class Travel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewportTravel: null
    }

    this.controller = new ScrollMagic.Controller();

    this.travelFadein = new TimelineMax();

    this.travelAnimation.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    // pass the viewport props as a state of this component,
    // could not use the props anywhere, dont know why?
    // need to check if this is good practice
    this.setState({
      viewportTravel: nextProps.viewport
    })
  }

   componentDidUpdate (prevProps, prevState) {
     const {viewportTravel} = this.state;
     //console.log('componentDidUpdate' ,viewportTravel)
     //const scrollmagicPin = document.querySelector('.scrollmagic-pin-spacer');
     //console.log(scrollmagicPin);
     if(this.controller === undefined && viewportTravel === 'desktop') {
        //console.log('travel desktop');
       //reInitialize scrollmagic and timeline
       this.controller = new ScrollMagic.Controller();
       //this.controller.addScene([this.pinIntroScene, this.pinIntroScene2, this.ourScene]);
       this.travelFadein = new TimelineMax();
       this.travelAnimation();
     } else if(this.controller  && viewportTravel === 'mobile'){

       //remove inline style added by scrollmagic
       this.refs.travel.style.cssText = "";

       //destroy all scene timeline and contorller
       this.controller.removeScene();
       this.travelFadein.kill();
       this.controller = this.controller.destroy(true);
       //this.unwrap(document.querySelector('.scrollmagic-pin-spacer'));
     }
  }

  componentDidMount () {
    this.travelAnimation();
  }

  travelAnimation = () => {
    this.travelFadein
      .from(this.refs.travel, 1, {autoAlpha: 0, ease: Power0.easeNone})
      .to(this.refs.buttonMask, 1, {x: "100%", delay:0.3, ease:Power2.easeOut}, 0);

    //build a scene
    this.travelScene = new ScrollMagic.Scene({
      triggerElement: this.refs.travel,
      triggerHook: 0.3,
      offset: '-80%',
    })

    this.travelScene
      .setTween(this.travelFadein)
      .addTo(this.controller);
  }

  render() {
    const {viewportTravel} = this.state;

    return (
      <div className="tomsah-travel tomsah-page-section--xl" ref="travel" >

       <div className="tomsah-globe hidden-md hidden-lg" ref="globe">
            {
              (viewportTravel === 'mobile') ? <GlobeCanvas /> : ''
            }
      </div>



        <p>
          I"ve been on an amazing one-year trip around the world.
          The journey enriched me and made me a better person.
        </p>
        <hr />
        <ul className="tomsah-travel__info">
          <li> <span>Days:</span> 365</li>
          <li> <span>Km {/*travelled*/}:</span> 112 334</li>
          <li> <span>cities:</span>37</li>
          <li> <span>continents:</span> 3</li>
          <li> <span>{/*Mountains*/} climb:</span> 7</li>
          <li> <span>Photos {/*taken*/}: </span>13 000</li>
        </ul>
        <a href="#" className="tomsah-button tomsah-button--white"  onClick={this.props.toggleMenu} ref="travelBtt">
          <span className="mask" ref="buttonMask"></span>
          <span>Check out my work</span>
         </a>
      </div>
    )
  }
}

// Travel.propTypes = {
//   toggleMenu: PropTypes.func.isRequired,
// }
export default Travel;