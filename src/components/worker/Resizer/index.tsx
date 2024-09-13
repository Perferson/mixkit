import "./index.scss";
import type { ElementLines, ElementLinesMap, RemoveElementLines, ResizerHandle, UpdateElementLinesMap, UpdateMatchedLines } from "../types";
import { defineComponent, inject, onMounted, onUnmounted, reactive, ref, type Ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useId } from "./utils";
import { mapOmit } from "@/utils/map";

function getPosition(e: MouseEvent) {
  return [
    e.clientX,
    e.clientY,
  ]
}

const AllResizerHandle: ResizerHandle[] = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br']

const Resizer = defineComponent({
  setup(props, { slots }) {
    const id = useId();

    const elementLinesMap = inject<Ref<ElementLinesMap>>('elementLinesMap');
    const updateElementLinesMap = inject<UpdateElementLinesMap>('updateElementLinesMap');
    const removeElementLines = inject<RemoveElementLines>('removeElementLines');
    const updateMatchedLines = inject<UpdateMatchedLines>('updateMatchedLines');

    const minWidth = 50;
    const minHeight = 50;

    const resizerRef = ref<HTMLElement | null>(null);

    const isActive = ref(false);
    onClickOutside(resizerRef, () => isActive.value = false);

    onUnmounted(() => {
      removeElementLines?.(id);
    })
    onMounted(() => {
      onElementUpdate();
    })

    const onElementUpdate = () => {
      const [cols, rows] = getElementLine(resizerRef.value!);
      updateElementLinesMap?.(id, { cols, rows });
    }

    function getElementLine(target: HTMLElement) {
      const { top, left, width, height, bottom, right } = target.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      return [
        [left, centerX, right],
        [top, centerY, bottom],
      ]
    }

    const style = reactive({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
    });

    const isNearly = (a: number, b: number, diff = 10) => Math.abs(a - b) < diff;

    const onDrag = (e: MouseEvent) => {
      const { top, left, width, height } = style;
      const [startX, startY] = getPosition(e);

      const onMouseMove = (e: MouseEvent) => {
        const [endX, endY] = getPosition(e);
        const diffX = endX - startX;
        const diffY = endY - startY;

        let newTop = top + diffY;
        let newLeft = left + diffX;

        if (elementLinesMap?.value?.size) {
          const otherElementLines = mapOmit(elementLinesMap.value, id);
          if (otherElementLines.size) {
            const near = 10;

            const selfCols = [newLeft, newLeft + width / 2, newLeft + width];
            const selfRows = [newTop, newTop + height / 2, newTop + height];

            const cols = Array.from(otherElementLines.values()).map(({ cols }) => cols).flat();
            const rows = Array.from(otherElementLines.values()).map(({ rows }) => rows).flat();

            const matchedLine: unknown = {
              rows: selfRows.map((row, index) => {
                let match = null;
                rows.forEach((line) => {
                  if (isNearly(row, line, near)) {
                    match = line;
                  }
                })
                if (match !== null) {
                  if (index === 0) {
                    newTop = match;
                  } else if (index === 1) {
                    newTop = match - height / 2;
                  } else if (index === 2) {
                    newTop = match - height;
                  }
                }
                return match;
              }).filter(i => i !== null),
              cols: selfCols.map((col, index) => {
                let match = null;
                cols.forEach((line) => {
                  if (isNearly(col, line, near)) {
                    match = line;
                  }
                })
                if (match !== null) {
                  if (index === 0) {
                    newLeft = match;
                  } else if (index === 1) {
                    newLeft = match - width / 2;
                  } else if (index === 2) {
                    newLeft = match - width;
                  }
                }
                return match;
              }).filter(i => i !== null),
            }

            updateMatchedLines?.(matchedLine as ElementLines);
          }
        }
        Object.assign(style, {
          top: newTop,
          left: newLeft,
        });
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        onElementUpdate();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    const onResize = (e: MouseEvent, handle: ResizerHandle) => {
      e.stopPropagation();
      e.preventDefault();

      const { width, height, top, left } = style;
      const [startX, startY] = getPosition(e);


      const onMouseMove = (e: MouseEvent) => {
        const [endX, endY] = getPosition(e);
        const diffX = endX - startX;
        const diffY = endY - startY;

        const hasT = handle.includes('t');
        const hasB = handle.includes('b');
        const hasL = handle.includes('l');
        const hasR = handle.includes('r');

        const newWidth = Math.max(minWidth, width + (hasL ? -diffX : hasR ? diffX : 0));
        const newHeight = Math.max(minHeight, height + (hasT ? -diffY : hasB ? diffY : 0));
        const newLeft = hasL ? left + width - newWidth : left;
        const newTop = hasT ? top + height - newHeight : top;

        Object.assign(style, {
          width: newWidth,
          height: newHeight,
          top: newTop,
          left: newLeft,
        });
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        onElementUpdate();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }


    return () => (
      <div
        ref={resizerRef}
        class={['resizer', { active: isActive.value }]}
        style={{
          width: style.width + 'px',
          height: style.height + 'px',
          top: style.top + 'px',
          left: style.left + 'px',
        }}
        onMousedown={onDrag}
        onClick={() => isActive.value = true}
      >
        {slots.default?.()}
        {AllResizerHandle.map((handle) => (
          <div
            class={['resizer-handle', 'resizer-handle-' + handle]}
            style={{ display: isActive.value ? 'block' : 'none' }}
            onMousedown={(e: MouseEvent) => onResize(e, handle)}
          />
        ))}
      </div>
    );
  },
})

export default Resizer;
