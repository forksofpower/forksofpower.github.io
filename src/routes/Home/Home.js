import React, { Component} from 'react';
import './Home.css';
import { connect } from 'react-redux';
import { showMenu, hideMenu, toggleMenu } from "../../actions/menuActions";


class Logo extends Component {
  constructor(props, context) {
    super(props, context);
    this.columns = this.props.columns || 3;
    this.name = this.props.name.toUpperCase().replace(/\s/g, '');
    this.rows = this.groupLetters(this.name, this.columns);
  }

  groupLetters(text, columns) {
    // group by multiples of columns and split strings to arrays
    let regex = new RegExp(`.{1,${columns}}`, 'g');
    return text.match(regex).map( t => t.split(''));
  }
  render() {
    return (
      <div className="letters">
        {
          // iterate nested arrays to create rows of letters
          this.rows.map( (inner, i) => (
            <div className="row" key={i}>
              {inner.map( (letter, j) => (
                <div className="letter-square" key={(j+letter+i)}>{letter}</div>
              ))}
            </div>
          ))
        }
      </div>
    )
  }
}
const Home = () => (
  <div className="content-wrapper home-title">
    <Logo name={"Patrick Jones"} columns={3} />
  </div>
);

export default Home;