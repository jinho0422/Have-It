import React, { Component } from 'react';
import Plx from 'react-plx';

import '../../lib/styles/style.css'

const parallaxData = [
  {
    start: 'self',
    end: 700,
    properties: [
      {
        startValue: 0.5,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
];

function importAll(r) {
    return r.keys().map(r);
  }
  
const images = importAll(require.context('../../imgs', false, /\.(png|jpe?g|svg)$/));

const idx = Math.floor(Math.random() * 100) % images.length + 1;

// const bgImg = `url(${'https://www.itl.cat/pngfile/big/187-1878501_a-very-high-resolution-large-format-vast-photo.jpg'})`;
const bgImg = `url(${images[idx]})`

export default class Example extends Component {
  render() {
    return (
        <Plx
            className='MyAwesomeParallax'
            parallaxData={ parallaxData }
            style={{backgroundImage: bgImg, height:window.screen.height * 0.85, width:'100%'}}
            >
        </Plx>
    );
  }
}