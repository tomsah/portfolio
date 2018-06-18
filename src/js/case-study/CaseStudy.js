import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import 'debug.addIndicators';
import imgUrl from '../../images/ses-site.png';
import imgUrl2 from '../../images/caseStudy/mobile1.jpg';
import imgUrl3 from '../../images/caseStudy/mobile2.jpg';
import imgUrl4 from '../../images/caseStudy/homepage.png';

class CaseStudy extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewportCs: null
    }

   this.cstextAnimation.bind(this);
   this.parallaxTL = new TimelineMax();
   this.csTextController = new ScrollMagic.Controller();



   this.csFooterAnimation.bind(this);
   this.footerTl = new TimelineMax();
   this.footerController = new ScrollMagic.Controller();

  }

  componentWillReceiveProps(nextProps, nextState) {
    // pass the viewport props as a state of this component,
    // could not use the props anywhere, dont know why?
    // need to check if this is good practice
    this.setState({
      viewportCs: nextProps.viewport
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const {viewportCs} = this.state;
    const {openProject, menuExpanded} = this.props;

    //initialzie footer animation only when a project is open
    if( openProject ) {
      this.footerTl.clear();
      this.refs.csFooter.style.cssText = "";
      this.csFooterAnimation();
    }
    if(this.csTextController === undefined && viewportCs === 'desktop') {

      this.cstextAnimation();

    } else if(this.csTextController  && viewportCs === 'mobile'){

      //remove inline style added by scrollmagic
      this.refs.descriptionText.style.cssText = "";

    }

  }


  componentDidMount () {
   this.cstextAnimation();
  }




  cstextAnimation = () => {
      this.parallaxTL
        //.fromTo(this.refs.descriptionText, 0.8, {y: '25%'}, {y: '33%',  ease: Power1.easeOut}, '+=0.3');
        .from(this.refs.descriptionText, 1 , {ease: Circ.easeOut, y: '125%'});

      this.slideParallaxScene = new ScrollMagic.Scene({
        triggerElement: this.refs.descriptionSection,
        triggerHook: 0.55,
      });

      this.slideParallaxScene
        .setTween(this.parallaxTL)
        //.addIndicators('.tomsah-case', {name: 'text parralax'})
        .addTo(this.csTextController)
  }


  csFooterAnimation = () => {
    const {viewportCs} = this.state;

    let reponsiveHeight = (viewportCs === 'mobile' ? 70 : 100);
    this.footerTl
        .to(this.refs.csFooter, 0.8, {bottom: reponsiveHeight, ease: Power1.easeOut})

    this.footerScene = new ScrollMagic.Scene({
      triggerElement: this.refs.footerTrigger,
      triggerHook: 0.8,
    });

    this.footerScene
      .setTween(this.footerTl)
     // .addIndicators('.tomsah-case__main__container', {name: 'text parralax'})
      .addTo(this.footerController)
  }



  render() {
    const {name, index, projectNumber, team, technologies, year, image, image2, image3, image4, statement, text, statement2} = this.props.project;
    const {className, id, clickHandler, projectNav} = this.props;
    console.log('IMG',image, image2);
    return (
      <div className={className} id={id} onClick={clickHandler}>

        <div className="tomsah-case__title">
           <div className="tomsah-case__title__number">
             <span>{projectNumber}</span>
             <hr />

             <div className="tomsah-case__title__number__preview"
                  ref='caseNumberPreview'>
               <span>{projectNumber}</span>
             </div>

           </div>
           <h2>{name}</h2>

           <div className="tomsah-case__title__technologies hidden-md hidden-lg">
             <ul>
               {
                 technologies.map((technology, index) => {
                   return <li key={index}>{technology}</li>
                 })
               }
             </ul>
           </div>
         </div>

         <div className="tomsah-case__details">
           <div className="tomsah-case__details__client">
            <p> <span>client:</span> {name} </p>
            <p> <span>team:</span> {team} </p>
           </div>

            <div className="tomsah-case__details__technologies hidden-xs hidden-sm">
              <ul>
                {
                  technologies.map((technology, index) => {
                    return <li key={index}>{technology}</li>
                  })
                }
              </ul>
            </div>
         </div>



         <div className="tomsah-case__main">
           <div className="tomsah-case__main__container reset-padding" ref="mainContainer">

             <div className="">


               <div className="col-md-11">
               <div className="tomsah-case__main__hero" ref="heroImg">
                 <img src={image} alt=""/>
               </div>
                 <div className="tomsah-case__main__description" ref="descriptionSection">
                  <div className="col-md-8 tomsah-case__main__description__text" >
                      <p ref="descriptionText">{text}</p>
                  </div>
                  <div className="tomsah-case__main__description__statement hidden-xs hidden-sm">
                    <h2>{statement}</h2>
                  </div>
                </div>
                <div className="tomsah-case__main__mobile-showcase">
                  <div className="row margin-reset">
                    <div className="col-md-4 tomsah-case__main__mobile-showcase__statement">
                      <h3>{statement2}</h3>
                    </div>
                    <div className="col-xs-6 col-md-4 tomsah-case__main__mobile-showcase__display">
                      {/*cc<img src={require(`${image2}`)} alt=""/>*/}
                      <img src={image2} alt=""/>
                    </div>
                    <div className="col-xs-6 col-md-4 tomsah-case__main__mobile-showcase__display">
                      <img src={image3} alt=""/>
                    </div>
                  </div>
                </div>
                <div className="row tomsah-case__main__homepage-showcase" ref="csHomepageSection">
                  <div className="col-xs-12 reset-padding">
                    <img src={image4} alt=""/>
                  </div>
                </div>

                <div className="footer-trigger" ref="footerTrigger"></div>
               </div>
             </div>
           </div>
           <a href="#"
              className="tomsah-button hidden-xs hidden-sm"
              id="projectOpen"
              onClick={this.props.togglePreviewCase.bind(null, index)}>view project
          </a>

           <div className="tomsah-case__year" ref="csYear">
              <p>{year}</p>
           </div>


         </div> {/*end of main*/}


         <div className="tomsah-case__footer" ref="csFooter" onClick={this.props.projectNav.bind(this)}>
            <div className="">
              <a href='#'>next project <span></span></a>
            </div>
         </div>

      </div>
    )
  }
}
export default CaseStudy;