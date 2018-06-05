import React, {Component} from 'react';
//import Globe from './Globe';
//import Globe2 from './Globe2';
import GlobeCanvas from './GlobeCanvas';
import PropTypes from 'prop-types';
import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import 'debug.addIndicators';
import TweenMax  from 'gsap';

import imageGlobe from '../images/globe.png';

class Intro extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewportIntro: null
    }

    this.introAnimation.bind(this);
   // this.unwrap.bind(this);

   //Init scrollMagic
   this.controller = new ScrollMagic.Controller();

   this.pinIntroScene = new ScrollMagic.Scene({
     triggerElement: this.refs.title,
     triggerHook: -150,
     duration: '50%',
     offset: '10%'
   });

   this.tlIntro= new TimelineMax({force3D:false});

   this.pinIntroScene2 = new ScrollMagic.Scene({
     triggerElement: this.refs.title,
     triggerHook: 0.3,
     duration: '120%',
     offset: '20%'
   });

   this.pinIntroSceneFinal = new ScrollMagic.Scene({
    triggerElement: this.refs.globe,
    // triggerHook: 1
   })

  }

  // unwrap(wrapper) {
  //   console.log('should unwrap');
  //     // place childNodes in document fragment
  //     var docFrag = document.createDocumentFragment();
  //     while (wrapper.firstChild) {
  //         var child = wrapper.removeChild(wrapper.firstChild);
  //         docFrag.appendChild(child);
  //     }

  //     // replace wrapper with document fragment
  //     wrapper.parentNode.replaceChild(docFrag, wrapper);
  // }

  componentWillReceiveProps(nextProps, nextState) {
    // pass the viewport props as a state of this component,
    // could not use the props anywhere, dont know why?
    // need to check if this is good practice
    this.setState({
      viewportIntro: nextProps.viewport
    })
  }

 componentDidMount() {
    this.introAnimation();
  }

  componentDidUpdate (prevProps, prevState) {
    const {viewportIntro} = this.state;
    const scrollmagicPin = document.querySelector('.scrollmagic-pin-spacer');
    //console.log(scrollmagicPin);
    if(this.controller === undefined && viewportIntro === 'desktop') {

      //reInitialize scrollmagic and timeline
      this.controller = new ScrollMagic.Controller();
      this.controller.addScene([this.pinIntroScene, this.pinIntroScene2]);
      this.tlIntro= new TimelineMax();
      this.introAnimation();

    } else if(this.controller  && viewportIntro === 'mobile'){

      //remove inline style added by scrollmagic
      this.refs.globe.style.cssText = "";
      this.refs.intro.style.cssText = "";
      //scrollmagicPin.style.cssText = "";


      //destroy all scene timeline and contorller
      this.pinIntroScene2.removePin(true);
      this.controller.removeScene([this.pinIntroScene, this.pinIntroScene2]);
      this.tlIntro.kill();
      this.controller = this.controller.destroy(true);
      //this.unwrap(document.querySelector('.scrollmagic-pin-spacer'));
    }
  }

  introAnimation = () => {

    const {viewportIntro} = this.state;
    // console.log('introAnimation', viewportIntro);
    this.tlIntro
       .to(this.refs.intro, 0.5 , {autoAlpha: 0, ease: Power0.easeNone})
       .to(this.refs.globe, 1, {
          scale: 1.1,
          left: 100 ,
          top: 200,
          opacity: 0.9,
          ease:Power2.easeInOut}, '-=0.15');

    //pin tag line
     this.pinIntroScene
       .setPin(this.refs.intro, {pushFollowers: false})
       .addTo(this.controller);

    //pin gloge and play gsap animation
     this.pinIntroScene2
       .setPin(this.refs.globe, {pushFollowers: false})
       .setTween(this.tlIntro)
       .addTo(this.controller);

    // this.pinIntroSceneFinal
    //   .setPin(this.refs.globe, {pushFollowers: false})
    //   .setTween(this.tlIntro)
    //   .addTo(this.controller);
  }

  render () {
    return (
      <div className="col-xs-12 col-md-4 tomsah-intro reset-gutter-padding-mobile">
        <h1 className="tomsah-intro__title text-uppercase" ref="title">hi</h1>

        <div className="row">
          <div className="col-xs-12 col-md-10 col-md-offset-1">
             <div className="tomsah-intro__text" ref="intro">
              <p>
                I'm Thomas. French front-end developer and climber based in London.<br/>
                Currently on a one-year trip around the world.
              </p>
             </div>
          </div>
        </div>

        <div className="tomsah-globe hidden-xs hidden-sm" ref="globe">
            {/*<img src={imageGlobe} alt="" ref="globeImg"/>*/}
            {/*<Globe />*/}
            <GlobeCanvas />
            {/* <Globe2 />*/}
        </div>

        <hr className="hidden-md hidden-lg"/>
      </div>
    )
  }
}

export default Intro;
