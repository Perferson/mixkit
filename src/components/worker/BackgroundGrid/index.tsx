import { defineComponent } from "vue";

const GRID_SIZE_S = 10;
const GRID_COUNT = 5;
const GRID_SIZE_L = GRID_SIZE_S * GRID_COUNT;

const BackgroundGrid = defineComponent({
  render() {
    return (
      <svg style="position: absolute; top: 0; left: 0;" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width={GRID_SIZE_S} height={GRID_SIZE_S} patternUnits="userSpaceOnUse">
            <path
              d={`M ${GRID_SIZE_S} 0 L 0 0 0 ${GRID_SIZE_S}`}
              fill="none"
              stroke="rgba(207, 207, 207, 0.3)"
              stroke-width="1">
            </path>
          </pattern>
          <pattern id="grid" width={GRID_SIZE_L} height={GRID_SIZE_L} patternUnits="userSpaceOnUse">
            <rect width={GRID_SIZE_L} height={GRID_SIZE_L} fill="url(#smallGrid)"></rect>
            <path
              d={`M ${GRID_SIZE_L} 0 L 0 0 0 ${GRID_SIZE_L}`}
              fill="none"
              stroke="rgba(186, 186, 186, 0.5)"
              stroke-width="1">
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"></rect>
      </svg>
    )
  }
})

export default BackgroundGrid;
