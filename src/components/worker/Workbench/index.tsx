import { computed, defineComponent, h, provide, ref } from "vue";
import BackgroundGrid from "../BackgroundGrid";
import type { ElementLines, ElementLinesMap, OnElementPositionUpdate, RemoveElementLines, UpdateElementLinesMap, UpdateMatchedLines } from "../types";

const Workbench = defineComponent({
  setup(props, { slots }) {
    const elementLinesMap = ref<ElementLinesMap>(new Map());

    const matchedLines = ref<ElementLines>({ cols: [], rows: [] });
    const matchedCols = computed(() => matchedLines.value.cols);
    const matchedRows = computed(() => matchedLines.value.rows);

    const updateMatchedLines: UpdateMatchedLines = (lines) => {
      matchedLines.value = lines
    }
    const updateElementLinesMap: UpdateElementLinesMap = (target, lines) => {
      elementLinesMap.value.set(target, lines);
    }
    const removeElementLines: RemoveElementLines = (target) => {
      elementLinesMap.value.delete(target);
    }

    provide('elementLinesMap', elementLinesMap);
    provide('updateElementLinesMap', updateElementLinesMap);
    provide('removeElementLines', removeElementLines);
    provide('updateMatchedLines', updateMatchedLines);

   
    function referenceLineRender() {
      return [
        ...matchedCols.value.map((item) => {
          return h('div', {
            style: {
              width: '0',
              height: '100%',
              top: '0',
              left: item + 'px',
              borderLeft: `1px dashed red`,
              position: 'absolute'
            }
          })
        }),
        ...matchedRows.value.map((item) => {
          return h('div', {
            style: {
              width: '100%',
              height: '0',
              left: '0',
              top: item + 'px',
              borderTop: `1px dashed red`,
              position: 'absolute'
            }
          })
        })
      ]
    }

    return () => h('div', {
      style: {
        position: 'relative',
        height: '100%',
        width: '100%',
      }
    }, [
      h(BackgroundGrid),
      h('div', {
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        }
      }, [...referenceLineRender()]),
      slots.default?.(),

    ])
  }
})

export default Workbench;
