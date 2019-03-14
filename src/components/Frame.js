/** @jsx jsx */

import {jsx, css} from '@emotion/core';

const cssFrame = css`
  width: 300px;
  height: 300px;
`;

function Frame({color}) {
  return (
    <div css={[cssFrame, css({backgroundColor: color})]}>

    </div>
  );
}

export default Frame;