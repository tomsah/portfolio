import React from 'react';
import data from './data/Data';
import Intro from './Intro';
import Main from './Main';
import Projects from './Projects';
import {TweenMax, TweenLite} from 'gsap';
import ScrollMagic from 'scrollmagic';
import TransitionGroup from 'react-addons-transition-group';
import debounce from 'lodash/debounce'

import PropTypes from 'prop-types';

class App extends React.Component {

    constructor(props){
      super(props);

      this.state = {
        menuOnloadPreview: true,
        menuActive: false,
        allProjects: data.projects,
        menuExpanded: false,
        targetPanel: null,
        activePanel: null,
        openProject: false,
        viewport: null,
      }

      // menu items
      this.menuItems = [];

      //timeline for the menu slide back onLoad
      this.menuIntroTl = new TimelineMax({paused: true, delay: 2,repeat: 0});
      // menu tween
      this.menuTl = new TimelineMax({paused:true}); //force3D:false
      // fullscreen tl
      this.fullscreenTl =  new TimelineLite({paused:true});
      //animate case number on preview and active
      this.previewNumberTl = new TimelineMax({paused: true, reversed: true});
      //animate case number on preview and active
      this.previewNumberTlUp = new TimelineMax({paused: true, reversed: true});
      //Reset case layout
      this.resetCsTl =  new TimelineLite({paused:true});
      //project nav
      this.projectNavTl = new TimelineMax({paused: true});

      this.introMenu.bind(this);


      //debouce the resize function using loadash debouce method
      this.handleResize = debounce(this.handleResize, 60);

      //TOODO find a better way to access the body
      this.body = document.getElementsByTagName('body')[0];
    }


    componentDidMount() {
      //onLoad cancel the sroll time the menu slideback
      this.body.classList.add('no-scroll');

      this.handleResize();

      this.initializeDataArray();

      this.createMenuTween();

      this.projectNav();

      if (window) window.addEventListener('resize', debounce(this.handleResize, 66))


      // remove the 30px gap when user srcolled 30px
      var projectContainerController = new ScrollMagic.Controller();
      var scene = new ScrollMagic.Scene({
        triggerElement: '#main-container',
        triggerHook: 0,
        offset: 30
      })
      .setTween('.tomsah-project', 0.1, {top: 0})
      .addTo(projectContainerController);

    }

    componentWillUnmount() {
      if (window) window.removeEventListener('resize', this.handleResize)
    }

    initializeDataArray () {
      const {allProjects} = this.state;
      for (var key in allProjects) {
        this.menuItems.push(`#${allProjects[key].id}`)
      }
    }

    closeMenuOutside = e => {
      const { menuExpanded, targetPanel, activePanel, viewport} = this.state;
      console.log(e.target, this.body);

      if(e.target.id === "project-container") {

        // if a panel is on preview mode reverse animation
        if(targetPanel !== null ) {

          this.CaseNumberAnimationUp(activePanel);

          if(viewport === 'desktop') {
            console.log('closeMenuOutside', e.target.id);
            return TweenLite.to(
              this.menuItems.slice(0, targetPanel + 1), 1, {
                x: '+=50%', ease: Power2.easeInOut,
                onComplete: () =>{

                  this.menuTl.reversed( menuExpanded );
                  this.body.classList.remove('no-scroll');
                }// on complete
            });// tweenlite instance
          }
        }
        this.setState({
          menuExpanded: !menuExpanded,
        }, () => {
          this.menuTl.reversed(menuExpanded);
          this.body.classList.remove('no-scroll');
        })
      }
    }

    projectNav = e => {
      const {activePanel, targetPanel} = this.state;

      console.log('projectNav', activePanel, this.menuItems[targetPanel + 1]);

      if(activePanel !== null) {
        e.stopPropagation();

       /*CASE NUMBER ANIMATION */
       this.CaseNumberAnimationUp(activePanel);
       /*CASE NUMBER ANIMATION */

       let nextProject = (targetPanel === this.menuItems.length - 1) ?
                            document.querySelector(`${this.menuItems[0]}`) :
                            document.querySelector(`${this.menuItems[targetPanel + 1]}`) ;

       let activeProject = document.querySelector(`${activePanel}`);
       let activeProjectBody = document.querySelector(`${activePanel} .tomsah-case__main`);

        this.projectNavTl
          .to(activePanel, 1, {x: '100%', ease: Power2.easeInOut,
            onComplete: () => {
              //reset panel layout to original position
              this.resetCsTl
                  .to(  `${activePanel} .tomsah-case__main` ,1, {x: 0})
                  .set( `${activePanel} .tomsah-case__main__hero img` , {x: '-65%', scale:(0.7)})
                  .set( `${activePanel} .tomsah-case__main__hero` , {marginTop: 50})
                  .set( `${activePanel} #projectOpen`, {autoAlpha: 1})
                  .play();

                  activeProject.classList.remove('in-view');
                  //scroll back to the top of the project
                  setTimeout(() => {
                   activeProjectBody.scrollTo(0,0);
                  },1000)

            }
        })
          .to(nextProject, 1, {x: '0%', ease: Power2.easeInOut,
            onStart: () => {
              let nextProjectAnimation = (targetPanel === this.menuItems.length -1) ? this.menuItems[0] : this.menuItems[targetPanel + 1];
              this.CaseNumberAnimation(nextProjectAnimation);

              this.fullscreenTl
                  .set(`${nextProjectAnimation} #projectOpen`, {autoAlpha: 0})
                  .to(`${nextProjectAnimation} .tomsah-case__main__hero img`, 1, {x: '-50%', scale:(1), ease: Power2.easeInOut})
                  .to(`${nextProjectAnimation} .tomsah-case__main__hero`, 1, {marginTop: 90, ease: Power2.easeInOut}, '-=1')
                  .play();
            },
            onComplete: () => {
              //allow scroll when on fullview
              nextProject.classList.add('in-view');

              this.setState({
                activePanel: (targetPanel === this.menuItems.length - 1) ? this.menuItems[0] : this.menuItems[targetPanel + 1],
                targetPanel: (targetPanel === this.menuItems.length - 1) ? 0 : targetPanel + 1
              })
              console.log('onComplete new activePanel in-view');
            }
        })
          .play();

      }
    }


    componentWillMount () {
     // trigger only once before the 1st render
     const { menuOnloadPreview} = this.state;
      if(window.innerWidth <= 992) {
        this.setState({
          viewport: 'mobile'
        }, () => {
          if(menuOnloadPreview) {
            this.introMenu();
          }
        })
      } else {
        this.setState({
          viewport: 'desktop'
        }, () => {
          if(menuOnloadPreview) {
            this.introMenu();
          }
        }
        )
      }
    }

    handleResize = () => {
      const {viewport, menuExpanded, menuOnloadPreview, targetPanel} = this.state;
      //on Project Full view do not trigger handleResize
      if(targetPanel !== null ) {
        return;
      }
      if(!menuOnloadPreview) {
        if(window.innerWidth <= 992) {
          this.setState({
            viewport: 'mobile'
          }, () => {
            TweenMax.set(this.menuItems, {clearProps: "transform"});
            this.createMenuTween();
          })
        } else {
          this.setState({
            viewport: 'desktop'
          }, () => {
            TweenMax.set(this.menuItems, {clearProps: "transform"});
            this.createMenuTween();
          }
          )
        }
      }
    }

    //animation for hidding projects after onload
    introMenu = () => {
      const {viewport, menuOnloadPreview} = this.state;
     //TODO access the project by ref to be more react
     var slides = document.getElementsByClassName('tomsah-case');
     //transform the HTMLcollection to an array
     var slides = Array.from(slides);

     let CaseDisplayWidth = (viewport === "mobile" ? 62.5 : 100);
     let containerSidePadding = (viewport === "mobile" ? 0 : 0);

     this.menuIntroTl
      .set(this.menuItems, { boxShadow: '0px -2px 10px 1px #403838'})
      .staggerFrom(slides, 1.3,{
        cycle: { x: (index) => {
          console.log(
            window.innerWidth,
            window.innerWidth + containerSidePadding
            )
          return (( (window.innerWidth + containerSidePadding) - (CaseDisplayWidth  * (slides.length - index) )) / (window.innerWidth + containerSidePadding) ) * 100 + '%';
        }
      },
        ease:Power2.easeInOut,
        onComplete: () => {
          TweenLite.set(this.menuItems, {boxShadow: '0 0 0 0 #ffff'});
          TweenLite.set('.tomsah-project', {zIndex: -5});
          this.setState({
            menuOnloadPreview: false
            }, () => {
              this.body.classList.remove('no-scroll');
            }
          )
        }
      })
      // .to('.tomsah-project', 1.3,{backgroundColor: 'rgba(0, 0, 0, 0.01)', ease:Power2.easeInOut}, 0)
      this.menuIntroTl.play();
    }

    // bring the project to view//
    createMenuTween = () => {
      this.menuTl.clear();

      const {viewport, menuExpanded} = this.state;
      let CaseDisplayWidth = (viewport === "mobile" ? 62.5 : 100);
      let containerSidePadding = (viewport === "mobile" ? 0 : 0);

      this.menuTl
        .set(this.menuItems, { boxShadow: '0px -2px 10px 1px #403838'})
        .set('.tomsah-project', {zIndex: 1})
        .staggerTo(this.menuItems, 1, {
          cycle: { x:  (index) => {
              return (( (window.innerWidth + containerSidePadding) - (CaseDisplayWidth * (this.menuItems.length - index) )) / (window.innerWidth + containerSidePadding) ) * 100  + '%';
          }
        },
          ease: Power2.easeInOut,
          onReverseComplete: () => {
            TweenLite.to(this.menuItems, 0.1, {boxShadow: '0 0 0 0 #ffffff'});
            TweenLite.to('.tomsah-project',0.1, { zIndex: -5,});
            this.setState({
              menuExpanded: false,
              targetPanel: null,
              activePanel: null,
              openProject: false
            },() => {
            TweenLite.set(this.menuItems, {boxShadow: '0 0 0 0 #ffff'});
            });
          }
        })
        .from('.project-bkg-fadeout', 0.1, {zIndex: -100}, 0)
        .from('.project-bkg-fadeout', 1, {backgroundColor: 'rgba(0, 0, 0, 0.01)', delay: 0.1, ease:Power2.easeInOut}, 0)
        .reverse();
    };

    CaseNumberAnimation = (panel) => {

      const {activePanel, viewport} = this.state;

      if(viewport === "mobile") {
        this.previewNumberTl
          .to(`${panel} .tomsah-case__title__number__preview`, 1, {height: "75px", ease: Power2.easeInOut})
          .to(`${panel} .tomsah-case__title__number__preview span`, 0.9, {zIndex: 1, autoAlpha: 1, ease: Power2.easeInOut}, '-=1')
          .play();
      }else {
        this.previewNumberTl
          .to(`${panel} .tomsah-case__title__number__preview`, 1, {height: "115px", ease: Power2.easeInOut})
          .to(`${panel} .tomsah-case__title__number__preview span`, 0.9, {zIndex: 1, autoAlpha: 1, ease: Power2.easeInOut}, '-=1')
          .to(`${panel} .tomsah-case__title h2`, 1 , {scale: 1.8, y: 50, marginTop: 20, delay: 0.2}, '-=1')
          .play();
      }


        this.setState({
          activePanel: panel
        });
        return this.previewNumberTl;
    }

    CaseNumberAnimationUp = (panel) => {
      const {activePanel} = this.state;
      console.log('up', activePanel);
      this.previewNumberTlUp
        .to(`${panel} .tomsah-case__title__number__preview`, 1, {height: "0px", ease: Power2.easeInOut})
        .to(`${panel} .tomsah-case__title__number__preview span`, 1 , {zIndex: 0, autoAlpha: 0, ease: Power2.easeInOut}, '-=1')
        .to(`${panel} .tomsah-case__title h2`, 1 , {scale: 1, y: 0, delay: 0.2}, '-=1')
        .play();

        this.setState({
          activePanel: panel
        });

        return this.previewNumberTlUp;
    }

    toggleMenu = e => {
      e.preventDefault();
      const { menuExpanded, targetPanel, menuActive, activePanel, openProject, viewport } = this.state;
      let openPanel = document.querySelector(activePanel);
      let csBody = document.querySelector(`${activePanel} .tomsah-case__main`);

      //timeline to reset the project layout
      this.resetCsTl
          .to(  `${activePanel} .tomsah-case__main` ,1, {x: 0})
          .set( `${activePanel} .tomsah-case__main__hero img` , {x: '-65%', scale:(0.7)})
          .set( `${activePanel} .tomsah-case__main__hero` , {marginTop: 50})
          .set( `${activePanel} #projectOpen`, {autoAlpha: 1})

      // if a panel is expanded, collapse any panel and then reverse
      if( targetPanel !== null && viewport === 'mobile') {
        this.CaseNumberAnimationUp(activePanel);
           return TweenLite.to(
             this.menuItems[targetPanel], 1,
             {x:'100%', ease: Power2.easeInOut,
               onComplete: () =>{
                console.log('play resetCsTl mobile');
                 // toggle the state property
                 TweenLite.to('.tomsah-project',0.1, { zIndex: -5 });
                 this.resetCsTl.play();
                 openPanel.classList.remove('in-view');
                 this.setState({
                   menuExpanded: !menuExpanded,
                   targetPanel: null,
                   activePanel: null,
                   openProject: false
                 },() => {
                   //TweenMax.set(this.menuItems, {clearProps: "transform"});
                   console.log('toggleMenu mobile should be close',menuExpanded);
                  // TweenLite.to('.tomsah-project',0.1, { zIndex: -5 });
                 });

                 this.body.classList.remove('no-scroll');
                 setTimeout(() => {
                  csBody.scrollTo(0,0);
                 },500)

                 this.menuTl.reversed( menuExpanded ).resume(0);
                 //TweenLite.set(this.menuItems, {clearProps: "all"});

               }// on complete
             })


      } else if  ( targetPanel !== null) {
        /*CASE NUMBER ANIMATION */
          this.CaseNumberAnimationUp(activePanel);
        /*CASE NUMBER ANIMATION */
          console.log('toggleMenu desktop close',
            this.menuItems.slice(0, targetPanel + 1),
            'targetPanel' ,targetPanel,
            'openPanel', openPanel
            )

          if(openProject) {
            console.log('i am closing from fullview', activePanel);
            return TweenLite.to(
              activePanel, 1, {
                x: '100%', ease: Power2.easeInOut,
                onComplete: () =>{
                 console.log('play resetCsTl desktop');
                  // toggle the state property
                  TweenLite.to('.tomsah-project',0.1, { zIndex: -5 });
                  this.resetCsTl.play();
                  openPanel.classList.remove('in-view');
                  this.setState({
                    menuExpanded: !menuExpanded,
                    targetPanel: null,
                    activePanel: null,
                    openProject: false
                  },() => {
                    //TweenMax.set(this.menuItems, {clearProps: "transform"});
                    console.log('toggleMenu mobile should be close',menuExpanded);
                   // TweenLite.to('.tomsah-project',0.1, { zIndex: -5 });
                  });

                  this.body.classList.remove('no-scroll');
                  setTimeout(() => {
                   csBody.scrollTo(0,0);
                  },500)

                  this.menuTl.reversed( menuExpanded ).resume(0);
                  //TweenLite.set(this.menuItems, {clearProps: "all"});

                }// on complete
              }
            )
          }

        let closePanel = openProject ? activePanel : this.menuItems.slice(0, targetPanel + 1);
        console.log(closePanel);
        return TweenLite.to(
          this.menuItems.slice(0, targetPanel + 1), 1, {
            x: '+=50%', ease: Power2.easeInOut,
            onComplete: () =>{
              this.menuTl.reversed( menuExpanded );
              this.resetCsTl.play();
              openPanel.classList.remove('in-view');
              this.body.classList.remove('no-scroll');
              //reset (noscroll &  scrolled back to the top) main container of the last active project
              setTimeout(() => {
                csBody.scrollTo(0,0);
              },500)
            }// on complete
        });// tweenlite instance
      }

      // when menu is open kill the scroll
      if(!this.state.menuExpanded){
        this.body.classList.add('no-scroll');
      } else {
        this.body.classList.remove('no-scroll');
      }

      // open/close menu and set state accordingly
      this.setState({
        menuExpanded: !menuExpanded,
        activePanel: null,
        openProject: false },
          () => {
            console.log('toggleMenu open after setting state')
           //return (!menuExpanded ? this.menuTl.play() : this.menuTl.reverse());
          }
        );
      this.menuTl.reversed(menuExpanded);
    };


    togglePreviewCase = (index, e) => {
      console.log('togglePreviewCase is called');
      const { menuItems } = this;
      const { targetPanel, activePanel, openProject, viewport } = this.state;

      let expandArray, collapseArray, reverseArray;
      let openPanel = document.querySelector(`${menuItems[index]}`);

      //if a project is fullscreen, return
      if(openProject) {
        console.log('togglePreviewCase should be cancel a project is fullview');
        //if a panel is open do not run any of those timeline
        event.preventDefault();
      } else if ( targetPanel === null && viewport === 'mobile') {
          //on mobile when a panel is going fullwidth
          console.log('togglePreviewCase mobile open panel');
          this.setState({ openProject: true })

          expandArray = menuItems.slice(index, index + 1);
          reverseArray = menuItems.filter(panel => panel !== expandArray[0]);

          TweenLite.to( reverseArray, 1, {x: '100%', ease:Power2.easeInOut});
          TweenLite.to( expandArray, 1, {x: '0%', ease:Power2.easeInOut,
            onComplete: () => {
              openPanel.classList.add('in-view');
            }})

          this.CaseNumberAnimation(expandArray);

      } else if ( targetPanel === null ) {
        console.log('togglePreviewCase desktop no panel was in preview');
        //On viewport Desktop project preview mode
        // only create an array for the elements that will be expanded
        expandArray = menuItems.slice(0, index + 1);
        TweenLite.to( expandArray, 1, {
          x: '-=50%', ease: Power2.easeInOut
        })

        //get the fist Click element manually cause state return null
        //Maybe better react approch
        let firstClickEl = expandArray[expandArray.length-1];
        this.CaseNumberAnimation(firstClickEl);

      } else if ( index < targetPanel ) {
        console.log('togglePreviewCase desktop other panel need to collapse to bring target in view')
        // the new target is already expanded, we have to collapse
        // the panels before that, there's no expand animation
        collapseArray = menuItems.slice(index + 1, targetPanel + 1);
        TweenLite.to( collapseArray, 1, {
          x: '+=50%', ease: Power2.easeInOut
        });

        /*CASE NUMBER ANIMATION */

        this.CaseNumberAnimationUp(activePanel, e);
        this.CaseNumberAnimation(menuItems[index], e);

        /*CASE NUMBER ANIMATION */

      } else if ( index > targetPanel ) {
        console.log('togglePreviewCase desktop preview target only oush other panel');
        // the new target is not expanded, we have to expand all the
        // elements between the previous target and the new one
        expandArray = menuItems.slice(targetPanel + 1, index + 1);
        TweenLite.to( expandArray, 1, {
          x: '-=50%', ease: Power2.easeInOut
        });

        /*CASE NUMBER ANIMATION */
        this.CaseNumberAnimationUp(activePanel);
        this.CaseNumberAnimation(menuItems[index]);
        /*CASE NUMBER ANIMATION */
      }
      else if ( index === targetPanel && e.target.id === "projectOpen" ) {

        // moving project to full view
        console.log('togglePreviewCase desktop make panel fullview');

        //let closeArr = menuItems.slice(targetPanel + 1, this.menuItems.length);
        let closeArr = menuItems.filter(panel => panel !== menuItems[index]);
        let openPanel = document.querySelector(`${menuItems[index]}`);

        //allow scroll on Project whenin full view
        openPanel.classList.add('in-view');
        this.fullscreenTl
            .set(`${menuItems[index]} #${e.target.id}`, {autoAlpha: 0})
            .to( closeArr , 0.5,{x: '100%', ease: Power2.easeInOut})
            .to( menuItems[index], 1, {x: '0%' , ease: Power2.easeInOut}, '-=0.5')
            .to(`${menuItems[index]} .tomsah-case__main__hero img`, 1, {x: '-50%', scale:(1), ease: Power2.easeInOut}, '-=1')
            .to(`${menuItems[index]} .tomsah-case__main__hero`, 1, {marginTop: 90, ease: Power2.easeInOut}, '-=1')
            .play();
        // the new target index should be the previous element if the
        // index is bigger than 0
        return this.setState({
          targetPanel: index,
          openProject: true });
      }
      // set the current index as the target panel
      this.setState({ targetPanel: index });
    };


    render(){

      const {menuActive, menuOnloadPreview, allProjects, slideMenu, menuExpanded, viewport, openProject} = this.state;
        return (
          <div>
          <div className="top-border"></div>
          <main id="main-container" className={`${menuExpanded ? 'is-menu-active' : ''}
                            ${menuOnloadPreview ? 'is-menu-preview' : ''}`} ref="main">
            <div className="container-fluid">
              <div className="tomsah-burger" onClick={this.toggleMenu}>
                <div className="tomsah-burger__wrapper">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="row">

                {/* intro start */}
                <Intro viewport={viewport}/>
                {/* intro end */}

                {/* start main section */}
                <Main toggleMenu={this.toggleMenu} viewport={viewport}/>
                {/* end main section */}

                {/* start of project section*/}
                <Projects
                  projectNav= {this.projectNav}
                  viewport = {viewport}
                  menuExpanded = {menuExpanded}
                  openProject = {openProject}
                  closeMenuOutside={this.closeMenuOutside}
                  allProjects={allProjects}
                  togglePreviewCase={this.togglePreviewCase}
                  ref={(node) => { this.child = node; }}
                />
                <div className="project-bkg-fadeout" id="project-container-bkg"></div>
                {/* end of project section*/}
              </div>
            </div>
            <div className="tomsah-border-bottom hidden-xs hidden-sm"></div>
            <div className="tomsah-border-right hidden-xs hidden-sm"></div>

            <div className="tomsah-background-text text-uppercase">
              HI, I am a front end developer
            </div>

          </main>
          </div>
        )
    }
}

export default App;