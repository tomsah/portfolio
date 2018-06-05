import React from 'react';
import data from './data/Data';
import Intro from './Intro';
import Main from './Main';
import Projects from './Projects';
import {TweenMax, TweenLite} from 'gsap';
import TransitionGroup from 'react-addons-transition-group';
import debounce from 'lodash/debounce'

import PropTypes from 'prop-types';


//TODO could move this in a constructor, question of style.
//const menuTl = new TimelineMax({paused: true,reversed: true});


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
      this.menuTl = new TimelineMax({paused:true});
      // fullscreen tl
      this.fullscreenTl =  new TimelineLite({paused:true});
      //animate case number on preview and active
      this.previewNumberTl = new TimelineMax({paused: true, reversed: true});
      //animate case number on preview and active
      this.previewNumberTlUp = new TimelineMax({paused: true, reversed: true});
      //Reset case layout
      this.resetCsTl =  new TimelineLite({paused:true});

      this.introMenu.bind(this);

     // this.closeMenuOutside.bind(this);

      //debouce the resize function using loadash debouce method
      this.handleResize = debounce(this.handleResize, 100);


      //TOODO find a better way to access the body
      this.body = document.getElementsByTagName('body')[0];
    }


    componentDidMount() {
     // const body = document.getElementsByTagName('body')[0];
      this.body.classList.add('no-scroll');

      this.handleResize();

      // this.introMenu();

      this.initializeDataArray();

      this.createMenuTween();

      //this.closeMenuOutside();

      if (window) window.addEventListener('resize', debounce(this.handleResize, 400))

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
      console.log(e.target.id);

      if(e.target.id === "project-container") {
        if(targetPanel !== null ) {
          this.CaseNumberAnimationUp(activePanel);

          if(viewport === 'desktop') {
            return TweenLite.to(
              this.menuItems.slice(0, targetPanel + 1), 1, {
                x: '+=50%', ease: Power2.easeInOut,
                onComplete: () =>{
                  this.setState({
                    menuExpanded: !menuExpanded,
                    targetPanel: null,
                    activePanel: null,
                    openProject: false
                  },() => {
                    console.log('set state when reverse is finish')
                  });
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
        })
      }
    }

    handleResize = () => {
      console.log('resize');
      const {viewport, menuExpanded, menuOnloadPreview, targetPanel} = this.state;
      // if (targetPanel !== null) {
      //   console.log(' menu is open or a panel is in view', menuExpanded, targetPanel );
      //   // this.menuTl.progress(1);
      //   // this.createMenuTween();
      //   //this.menuTl.set(this.menuItems, { clearProps: "all" });
      //   //return this.menuTl.pause()

      // }
      // this.menuTl.set(this.menuItems, { clearProps: "all" });
      // this.createMenuTween();

      if (menuExpanded) {
        this.setState({
          menuExpanded: !menuExpanded
        })
        console.log(menuExpanded);
        this.menuTl.reverse()
        this.menuTl.clear();
        this.menuTl.set(this.menuItems, { clearProps: "all" });
        //this.menuTl.play();
        // this.menuTl.kill()
      //  this.createMenuTween();
      }



        //this.menuTl.progress(0);
        this.menuTl.clear();
        this.menuTl.set(this.menuItems, { clearProps: "all" });
      //this.createMenuTween();
      //this.menuTl.kill();


      //if (menuExpanded)  this.menuTl.reverse();
     // console.log('handleResize', viewport)
        if(window.innerWidth <= 992) {
          this.setState({
            viewport: 'mobile'
          }, () => {
            if(menuOnloadPreview) {
              this.introMenu();
            }

            this.createMenuTween();
          })
        } else {
          this.setState({
            viewport: 'desktop'
          }, () => {
            if(menuOnloadPreview) {
              this.introMenu();
            }
            // this.menuTl.reverse().play();
            this.createMenuTween();
          })
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
     let containerSidePadding = (viewport === "mobile" ? 0 : 30);

     this.menuIntroTl
      .staggerFrom(slides, 1.3,{
        cycle: { x: (index) => {
          console.log(
            window.innerWidth,
            window.innerWidth + containerSidePadding
            )
          return (( (window.innerWidth + containerSidePadding) - (CaseDisplayWidth  * (slides.length - index) )) / (window.innerWidth + containerSidePadding) ) * 100 + '%';
        }},
        ease:Power2.easeInOut,
        onComplete: () => {
          TweenLite.set('.tomsah-project', {zIndex: -5});
          this.setState({
            menuOnloadPreview: false
            }, () => this.body.classList.remove('no-scroll')
          )
        }
      })
      this.menuIntroTl.play();
    }

    // bring the project to view//
    createMenuTween = () => {
      this.menuTl.clear();


      const {viewport, menuExpanded} = this.state;
      //console.log('createMenuTween', viewport, menuExpanded);
      let CaseDisplayWidth = (viewport === "mobile" ? 62.5 : 100);
      let containerSidePadding = (viewport === "mobile" ? 0 : 30);

      this.menuTl
        .set('.tomsah-project', {zIndex: 1})
        .staggerTo(this.menuItems, 1, {
          cycle: { x:  (index) => {
              return (( (window.innerWidth + containerSidePadding) - (CaseDisplayWidth * (this.menuItems.length - index) )) / (window.innerWidth + containerSidePadding) ) * 100  + '%';
          }},
          ease: Power2.easeInOut,

          onComplete: () => {
            console.log('menutl complete');
            //TweenLite.set('.tomsah-project', {zIndex: -5});
          },
          onReverseComplete: () => {
            console.log('menutl onReverseComplete')
           TweenLite.to('.tomsah-project',0.1, { zIndex: -5 });

          }
        })
        .reverse();
    };

    CaseNumberAnimation = (panel) => {

      const {activePanel, viewport} = this.state;

      if(viewport === "mobile") {
        this.previewNumberTl
          .to(`${panel} .tomsah-case__title__number__preview`, 1, {height: "75px", ease: Power2.easeInOut})
          .play();
      }else {
        this.previewNumberTl
          .to(`${panel} .tomsah-case__title__number__preview`, 1, {height: "115px", ease: Power2.easeInOut})
          .to(`${panel} .tomsah-case__title__number__preview span`, 1, {zIndex: 1, ease: Power2.easeInOut}, '-=1')
          .to(`${panel} .tomsah-case__title h2`, 1 , {scale: 1.8, y: 50, delay: 0.2}, '-=1')
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
        .to(`${panel} .tomsah-case__title__number__preview span`, 1, {zIndex: 0, ease: Power2.easeInOut}, '-=1')
        .to(`${panel} .tomsah-case__title h2`, 1 , {scale: 1, y: 0, delay: 0.2}, '-=1')
        .play();

        this.setState({
          activePanel: panel
        });

        return this.previewNumberTlUp;
    }

    toggleMenu = e => {
      const { menuExpanded, targetPanel, menuActive, activePanel, openProject, viewport } = this.state;
      let openPanel = document.querySelector(activePanel);
      let csBody = document.querySelector(`${activePanel} .tomsah-case__main`);
      // if a panel is expanded, collapse any panel and then reverse
      // the menu timeline
      if( targetPanel !== null && viewport === 'mobile') {
        console.log('hello from', viewport, openPanel, this.menuItems[targetPanel] );
        this.CaseNumberAnimationUp(activePanel);

           return TweenLite.to(
             this.menuItems[targetPanel], 1,
             {x:'100%', ease: Power2.easeInOut,
             onComplete: () =>{
               // toggle the state property
               TweenLite.to('.tomsah-project',0.1, { zIndex: -5 });
               this.resetCsTl
                   .to(  `${this.menuItems[targetPanel]} .tomsah-case__main` ,1, {x: 0})
                   .set( `${this.menuItems[targetPanel]} .tomsah-case__main__hero img` , {x: '-65%', scale:(0.7)})
                   .set( `${this.menuItems[targetPanel]} .tomsah-case__main__hero` , {marginTop: 50})
                   .set( `${this.menuItems[targetPanel]} #projectOpen`, {autoAlpha: 1})
                   .play()

               openPanel.classList.remove('in-view');

               this.setState({
                 menuExpanded: !menuExpanded,
                 targetPanel: null,
                 activePanel: null,
                 openProject: false
               },() => {
                 console.log('1',menuExpanded);
               });


               this.body.classList.remove('no-scroll');
               //reset (noscroll &  scrolled back to the top) main container of the last active project
               setTimeout(() => {
                  csBody.scrollTo(0,0);
               },500)

                // this.menuTl.reversed( menuExpanded );
               return this.menuTl.reversed( menuExpanded ).resume(0);
             }// on complete
             })


      } else if  ( targetPanel !== null) {
        /*CASE NUMBER ANIMATION */
          this.CaseNumberAnimationUp(activePanel);
        /*CASE NUMBER ANIMATION */

        return TweenLite.to(
          this.menuItems.slice(0, targetPanel + 1), 1, {
            x: '+=50%', ease: Power2.easeInOut,
            onComplete: () =>{
              this.resetCsTl
                  .to(  `${activePanel} .tomsah-case__main` ,1, {x: 0})
                  .set( `${activePanel} .tomsah-case__main__hero img` , {x: '-65%', scale:(0.7)})
                  .set( `${activePanel} .tomsah-case__main__hero` , {marginTop: 50})
                  .set( `${activePanel} #projectOpen`, {autoAlpha: 1})
                  .play()
              openPanel.classList.remove('in-view');


              this.setState({
                menuExpanded: !menuExpanded,
                targetPanel: null,
                activePanel: null,
                openProject: false
              },() => {
                console.log('set state when reverse is finish')
              });

              this.menuTl.reversed( menuExpanded );
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

      // toggle the state property
      this.setState({
        menuExpanded: !menuExpanded,
        activePanel: null,
        openProject: false },
          () => {
           //return (!menuExpanded ? this.menuTl.play() : this.menuTl.reverse());
          }
        );
      this.menuTl.reversed(menuExpanded);
    };

    // access the index and the event object
    // the index will tell us which panel is being targeted
    // and create the animation based on that parameter
    togglePreviewCase = (index, e) => {
      const { menuItems } = this;
      const { targetPanel, activePanel, openProject, viewport } = this.state;
      // create two arrays with the elements that should be animated
      // one for the elements that will be expanded and the ones that
      // will be collapsed
      let expandArray, collapseArray, reverseArray;
      // if the current target is null means no element is expanded
      if(openProject) {
        //if a panel is open do not run any of those timeline
        event.preventDefault();
        //return;
      } else if ( targetPanel === null && viewport === 'mobile') {
        //let openPanel = document.querySelector(`${menuItems[index]} .tomsah-case__main`);
        let openPanel = document.querySelector(`${menuItems[index]}`);

        //allow scroll on Project whenin full view
          this.setState({
            openProject: true
          })

          expandArray = menuItems.slice(index, index + 1);
          reverseArray = menuItems.filter(panel => panel !== expandArray[0]);


          TweenLite.to( reverseArray, 1, {x: '100%', ease:Power2.easeInOut});
          TweenLite.to( expandArray, 1, {x: '0%', ease:Power2.easeInOut,
            onComplete: () => {
              openPanel.classList.add('in-view');
            }})

          this.CaseNumberAnimation(expandArray);

      } else if ( targetPanel === null ) {
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

        let closeArr = menuItems.slice(targetPanel + 1, this.menuItems.length);
        let openPanel = document.querySelector(`${menuItems[index]}`);

        //allow scroll on Project whenin full view
        openPanel.classList.add('in-view');
        //console.log('x',menuItems[index]);
        //menuItems[index].classList.add('in-view');

        this.fullscreenTl
            .set(`${menuItems[index]} #${e.target.id}`, {autoAlpha: 0})
            .to( closeArr , 0.5,{x: '+=50%', ease: Power2.easeInOut})
            .to( menuItems[index], 1, {x: '0%' , ease: Power2.easeInOut}, '-=0.5')
            .to(`${menuItems[index]} .tomsah-case__main__hero img`, 1, {x: '-50%', scale:(1), ease: Power2.easeInOut}, '-=1')
            .to(`${menuItems[index]} .tomsah-case__main__hero`, 1, {marginTop: 90, ease: Power2.easeInOut}, '-=1')
            .play();
        // the new target index should be the previous element if the
        // index is bigger than 0
        return this.setState({
          targetPanel: targetPanel > 0 ? targetPanel - 1 : null,
          openProject: true });
      }
      // set the current index as the target panel
      this.setState({ targetPanel: index });
    };


    render(){

      const {menuActive, menuOnloadPreview, allProjects, slideMenu, menuExpanded, viewport, openProject} = this.state;
        return (
          <main className={`${menuExpanded ? 'is-menu-active' : ''}
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
                  viewport = {viewport}
                  menuExpanded = {menuExpanded}
                  openProject = {openProject}
                  closeMenuOutside={this.closeMenuOutside}
                  allProjects={allProjects}
                  togglePreviewCase={this.togglePreviewCase}
                  ref={(node) => { this.child = node; }}
                />
                {/* end of project section*/}
              </div>
            </div>
            <div className="tomsah-border-bottom hidden-xs hidden-sm"></div>
            <div className="tomsah-border-right hidden-xs hidden-sm"></div>

            <div className="tomsah-background-text text-uppercase">
              HI, I am a front end developer
            </div>

          </main>
        )
    }
}

export default App;