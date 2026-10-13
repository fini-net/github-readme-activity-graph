export const graphStyle = (color: string, line: string, point: string, area: string) =>
    `
    .ct-label {
      fill: #${color};
      color: #${color};
      font-size: .75rem;
      line-height: 1;
    }

    .ct-grid-background,
    .ct-line {
      fill: none;
    }

    .ct-chart-bar .ct-label,
    .ct-chart-line .ct-label {
      display: block;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
    }

    .ct-label.ct-horizontal.ct-start {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-label.ct-horizontal.ct-end {
      -webkit-box-align: flex-start;
      -webkit-align-items: flex-start;
      -ms-flex-align: flex-start;
      align-items: flex-start;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-label.ct-vertical.ct-start {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-end;
      -webkit-justify-content: flex-end;
      -ms-flex-pack: flex-end;
      justify-content: flex-end;
      text-align: right;
      text-anchor: end;
    }

    .ct-label.ct-vertical.ct-end {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-grid {
      stroke: #${color};
      stroke-width: 1px;
      stroke-opacity: 0.3;
      stroke-dasharray: 2px;
    }

    /* Emphasized gridlines at tick values divisible by 20
       (chicks-net/chicks-projects#129). The doubled-class selector
       out-specifies the .ct-grid rule above. */
    .ct-grid.ct-grid-major {
      stroke-opacity: 0.85;
      stroke-dasharray: none;
    }

    .ct-point {
      stroke-width: 10px;
      stroke-linecap: round;
      stroke: #${point};
      animation: blink 1s ease-in-out forwards;
    }

    .ct-line {
      stroke-width: 4px;
      stroke-dasharray: 5000;
      stroke-dashoffset: 5000;
      stroke: #${line};
      animation: dash 5s ease-in-out forwards;
    }

    /* Faded prior windows ("ghost" lines) behind the current line
       (chicks-net/chicks-projects#130). Fixed grey regardless of theme;
       the doubled-class selector out-specifies the .ct-line rule above
       for stroke, opacity and width, while the dash-draw animation and
       fill:none are inherited. */
    .ct-series-ghost .ct-line {
      stroke: #9e9e9e;
      stroke-opacity: 0.35;
      stroke-width: 2px;
    }

    .ct-area {
      stroke: none;
      fill-opacity: 0.1;
    }

    .ct-series-current .ct-area,
    .ct-series-current .ct-slice-pie {
      fill: #${area};
    }

    .ct-label .ct-horizontal {
      transform: rotate(-90deg)
    }
    `;

/** Unused style for dates feature #85 */
export const diagonalTiltStyle = () => {
    return `
    .ct-label.ct-horizontal.ct-end {
      transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      -moz-transform: rotate(-30deg);
      -o-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      transform-box: fill-box;
      transform-origin: 100% 0;
      text-anchor: end;
    }
  `;
};
