import React, {Component} from 'react';
import CaseStudy from './case-study/CaseStudy';
import PropTypes from 'prop-types';

class Projects extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activePanel: null,
    }


    this.togglePreviewCase = this.togglePreviewCase.bind(this);
    this.previewCaseReverseHandler = this.previewCaseReverseHandler.bind(this);
    // store the timeline in the component because we need to access
    // a callback that's inside the component in the reverse complete event
    this.previewCaseTl = new TimelineMax({
      paused:true,
      onReverseComplete: this.previewCaseReverseHandler
    });
  }

  previewCase = id => {
    var element = `#${id}`;

    // get an array of all the project
    var caseList = [];
    Object.keys(this.refs).forEach((key, index) => {

      const ref = this.refs[key];
      if(ref.props.id !== "") {
         caseList.push(`#${ref.props.id}`);
      }
    });

    console.log(caseList);

    // get an array of the project that need animation
    var idIndex = caseList.indexOf(element);
    var animatedList = caseList.splice(0, idIndex + 1);
    console.log('list', animatedList);

    //stagger Method
    this.previewCaseTl
        .staggerTo(animatedList, 1, {x: '-=50%', ease: Power2.easeInOut})
        .play();
  };

  togglePreviewCase = e => {
    const { activePanel } = this.state;
    const { id } = e.currentTarget;
    e.preventDefault();
    // first check if a panel is active
    if ( activePanel ) {
      // check if the id is the same of the active panel
      if ( activePanel === id ) {
        // the current panel is the active one, set the
        // state prop to null
        this.setState({ activePanel: null });
      } else {
        // the current panel is not the active
        this.setState({ activePanel: id });
      }
      // there's an active panel, reverse the timeline
      this.previewCaseTl.reverse();
    } else {
      // there's no active panel
      // set the active panel
      this.setState({ activePanel: id });
      // since there's no active panel the timeline is empty
      // add the instances to the timeline and play it
      this.previewCase(id);
    }
  };

  // the reverse complete callback
  // used to create the new instance of the panel tween
  // if there's an active panel
  previewCaseReverseHandler(){
    const { activePanel } = this.state;
    // if there's an active panelin the state, clear the timeline and
    // create a new instance with the active panel
    if ( activePanel ) {
      this.previewCaseTl.clear();
      this.previewCase(activePanel);
    } else {
      this.previewCaseTl.clear();
    }
  }

  render() {

    const {allProjects} = this.props;
    return (
      <div className="tomsah-project">

      {
        allProjects.map( (project, index) => {
          return <CaseStudy
            className="tomsah-case"
            ref={`CaseStudy${index}`}
            key={index}
            id={`project-${index + 1}`}
            project={project}
            clickHandler={this.togglePreviewCase}
            />
        })
      }
      </div>
    )
  }

}

export default Projects;

