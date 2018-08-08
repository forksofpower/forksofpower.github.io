import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import { Provider } from 'react-redux';

import FadeIn from 'react-fade-in';
import {Home, About, Contact, Projects, Work} from './routes';

import './App.css';
import anime from "animejs";
import Transition from "react-transition-group/Transition";
import TransitionGroup from "react-transition-group/TransitionGroup";

import store from './store';

const animationTimings = {
    gridEnter: 200,
    gridLeave: 600,
    cardEnter: 400,
    cardLeave: 400,
    cardStagger: 50
};

// we will trigger an event on the actual grid node after the exit animation completes
// to let the transitiongroup know that it can be removed from the DOM

// this is the only way to let react-transition-group delegate timing
// to the JavaScript animation (as far as I can tell?) unfortunately
const ANIMATION_DONE_EVENT = "animation::done";
const triggerAnimationDoneEvent = node => node.dispatchEvent(new Event(ANIMATION_DONE_EVENT));

// cache current animation so that it can be interrupted if necessary
let currentAnimation = null;
const clearCurrentAnimation = () => currentAnimation && currentAnimation.pause();

const getOpacity = animatingIn => ({
    value: animatingIn ? [0, 1] : [1, 0],
    easing: "linear",
    duration: 300
});
const AnimateNavIn = (navContainer, done) => {
    clearCurrentAnimation();
    const links = navContainer.querySelectorAll(".nav-link");
    currentAnimation = anime
        .timeline()
        .add({
            targets: links,
            opacity: 0,
            duration: 1
        })
        .add({
            targets: navContainer,
            opacity: getOpacity(true),
            duration: animationTimings.gridEnter
        })
        .add({
            targets: links,
            duration: 800,
            opacity: getOpacity(true),
            translateX: [-100, 0],
            complete: () => triggerAnimationDoneEvent(navContainer),
            delay: (el, i, l) => i * 100
        })
};
const AnimateNavOut = (navContainer, done) => {
    clearCurrentAnimation();
    const links = navContainer.querySelectorAll(".nav-link");
    currentAnimation = anime
        .timeline()
        .add({
            targets: links,
            duration: 700,
            opacity: getOpacity(false),
            translateY: -60,
            delay: (el, i) => i * 100
        })
        .add({
            targets: navContainer,
            translateY: -1000,
            opacity: getOpacity(false),
            duration: animationTimings.gridLeave,
            complete: () => triggerAnimationDoneEvent(navContainer),
            offset: "-=300"
        })
};
const AnimateNavLinkIn = link =>
    anime({
        target: link,
        translateX: 1000,
        opacity: getOpacity(true),
        complete: () => triggerAnimationDoneEvent(link),
        duration: animationTimings.cardEnter
    });
const AnimateNavLinkOut = link =>
    anime({
        target: link,
        translateX: -1000,
        opacity: getOpacity(false),
        complete: () => triggerAnimationDoneEvent(link),
        duration: animationTimings.cardLeave
    });

const NavigateToBlog = () => {
    clearCurrentAnimation();
    const sidebar = document.querySelector(".sidebar");
    const links = sidebar.querySelectorAll(".nav-link");
    const content = document.querySelector(".content");
    currentAnimation = anime
        .timeline()
        .add({
            target: content,
            duration: 700,
            opacity: getOpacity(false),
        })
        .add({
            targets: links,
            duration: 700,
            opacity: getOpacity(false),
            translateY: -30,
            delay: (el, i) => i * 100
        });
};

const FadingRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        <FadeIn>
            <Component {...props}/>
        </FadeIn>
    )}/>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Work', path: '/work'},
        // { name: 'Articles', path: '/articles' },
        { name: 'Contact', path: '/contact' },
      ],
      visible: true
    }
  };

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible});
  };
  render() {
    return (
      <Provider store={store}>
      <Router>
        <div style={{ display: "flex"}}>
          <Transition
              unmountOnExit
              appear
              addEndListener={(node, done) => node.addEventListener(ANIMATION_DONE_EVENT, done)}
              onEnter={AnimateNavIn}
              onExit={AnimateNavOut}
              in={this.state.visible}>
            <ul className={'topbar'}>
              <TransitionGroup component={null}>
              {
                this.state.items.map((item, index) => (
                  <Transition
                  key={item.name}
                  onEnter={AnimateNavLinkIn}
                  onExit={AnimateNavLinkOut}
                  addEndListener={(node, done) => {
                      node.addEventListener(ANIMATION_DONE_EVENT, done)
                  }}>
                    <li className="nav-link">
                      <NavLink exact to={item.path} activeClassName="nav-link-active">{item.name.toUpperCase()}</NavLink>
                    </li>
                  </Transition>
                ))
              }
              </TransitionGroup>
            </ul>
          </Transition>
          <div className="content">
            <button className={"toggle-menu"} type={"button"}
                    onMouseLeave={this.toggleVisible}
                    onMouseEnter={this.toggleVisible}
                    onClick={this.toggleVisible}>Toggle Menu</button>
            <FadingRoute exact path="/" component={Home} />
            <FadingRoute path="/about" component={About} />
            {/*<Route path="/blog" component={Blog}*/}
            <FadingRoute path="/projects" component={Projects} />
            <FadingRoute path="/work" component={Work} />
            <FadingRoute path="/contact" component={Contact} />
          </div>
        </div>
      </Router>
      </Provider>
    );
  };
}

export default App;
