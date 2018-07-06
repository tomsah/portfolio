import React, {Component} from 'react';
import PropTypes from 'prop-types';
import About from './main-section/About';
import Skills from './main-section/Skills';
import Contact from './main-section/Contact';
import Travel from './main-section/Travel';



class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    //const {toggleMenu} = this.props;

    return (
      <div className="col-xs-12 col-md-8 col-lg-7 reset-gutter-padding-mobile">

        {/* start about section */}
        <About />
        {/* end about section */}

        {/* start skills section */}
        <Skills />
        {/* end skills section */}

        {/* start contact section */}
        <Contact />
        {/* end contact section */}
        <Travel toggleMenu={this.props.toggleMenu} viewport={this.props.viewport}/>

      </div>
    )
  }
}





// const Main = ({toggleMenu}) => {

//   return (
//     <div className="col-md-8">

//       {/* start about section */}
//       <About />
//       {/* end about section */}

//       {/* start skills section */}
//       <Skills />
//       {/* end skills section */}

//       {/* start contact section */}
//       <Contact />
//       {/* end contact section */}
//       <Travel toggleMenu={toggleMenu} />

//     </div>
//   )
// }

Main.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
}

export default Main;