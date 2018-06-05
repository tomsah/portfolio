import React, {Component} from 'react';
import CaseStudy from './case-study/CaseStudy';
import PropTypes from 'prop-types';

class Projects extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {allProjects, togglePreviewCase, viewport, openProject, menuExpanded, projectNav} = this.props;
    return (
      <div className="tomsah-project" onClick={this.props.closeMenuOutside} id="project-container">
      {
        allProjects.map( (project, index) => {
          return <CaseStudy
            menuExpanded = {menuExpanded}
            openProject = {openProject}
            viewport = {viewport}
            className="tomsah-case"
            ref={`CaseStudy${index}`}
            key={index}
            id={`project-${index + 1}`}
            project={project}
            clickHandler={this.props.togglePreviewCase.bind(null, index)}
            togglePreviewCase={this.props.togglePreviewCase}
            projectNav={this.props.projectNav}
            />
        })
      }
      </div>
    )
  }

}

export default Projects;

