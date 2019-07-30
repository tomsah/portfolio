import { shallow } from 'enzyme';
import { App } from './js/App'

const wrapper = shallow(<App />);
 it('should render the app properly', () => {
   expect(wrapper).toBeTruthy()
 })
