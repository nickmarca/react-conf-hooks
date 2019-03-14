/** @jsx jsx */

import {jsx, css} from '@emotion/core';
import {useState, useEffect, useReducer} from 'react';
import Frame from './components/Frame';
import useProgress from './useProgress';

const appContainerCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`;

const controlContainerCss = css`
  margin-top: 20px;
  display: flex;
  align-items: flex-end;
`;

const progressBarCss = css`
  background-color: rgba(0, 0, 0, 0.4);
  height: 50px;
`;

const progressBarContainerCss = css`
  width: 300px;
  height: 50px;
`

const frames = [
  {color: 'blue'},
  {color: 'red'},
  {color: 'yellow'},
  {color: 'gold'},
  {color: 'green'},
];

const FRAME_DURATION = 1000;

function ProgressBar({animate, time}) {
  let progress = useProgress(animate, time);

  return (
    <div css={progressBarContainerCss}>
      <div css={progressBarCss} style={{width: `${progress * 100}%`}}/>
    </div>
  );
}

function App() {
/*  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);*/
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'PROGRESS':
      case 'NEXT': return {
        ...state,
        isPlaying: action.type === 'PROGRESS',
        currentIndex: (state.currentIndex + 1 ) % frames.length
      };
      case 'PREV': return {
        ...state,
        isPlaying: false,
        currentIndex: (state.currentIndex - 1 + frames.length) % frames.length
      };
      case 'PLAY': return {
        ...state,
        isPlaying: true,
      };
      case 'PAUSE': return {
        ...state,
        isPlaying: false,
      };
      default: return state;
    }
  }, {
    currentIndex: 0,
    isPlaying: false,
  });

  useEffect(() => {
    if(state.isPlaying) {
      const timeout = setTimeout(() => {
        dispatch({type: 'PROGRESS'});
      }, FRAME_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [state.currentIndex, state.isPlaying]);

  const frame = frames[state.currentIndex];
  return (
    <div css={appContainerCss}>
      <Frame {...frame} />

      <ProgressBar
        key={state.currentIndex + state.isPlaying}
        time={FRAME_DURATION}
        animate={state.isPlaying}
      />

      <div css={controlContainerCss}>

        {state.isPlaying ?
          <button onClick={() => {
            dispatch({type: 'PAUSE'});
          }}> Pause </button> :
          <button onClick={() => {
            dispatch({type: 'PLAY'});
          }}> Play </button>
        }

        <button onClick={() => {
          dispatch({type: 'PREV'});
        }}> {'<<'}  </button>
        <button onClick={() => {
          dispatch({type: 'NEXT'});
        }}> {'>>'} </button>
      </div>
    </div>
  );
}

export default App;
