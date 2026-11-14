import { useCallback, useEffect, useLayoutEffect, type RefObject } from 'react';

interface IFloatingPanelOptions {
  isOpen: boolean;
  /** The field the panel belongs to: it is placed against it, and clicks on it are not "outside" */
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  /** As wide as the anchor (dropdown lists) */
  matchWidth?: boolean;
};

const GAP_PX = 6;
const EDGE_PX = 8;

/**
 * A panel portaled to the body and fixed-positioned against its anchor, so a scrolling container
 * (a modal) neither clips it nor grows because of it. Opens below; above when there is more room there,
 * then anchored by its bottom edge so it doesn't drift when its content shrinks; when neither side fits,
 * it takes the roomier one and is capped to it (scrolls inside).
 * Closes on a click outside, on Escape (before a surrounding modal) and on any scroll outside the panel:
 * otherwise it would stay where the anchor was before the scroll.
 *
 * Measuring and placing is DOM work, so the styles go straight onto the panel, not through state. The panel's
 * CSS must make it `position: fixed; visibility: hidden` until placed, and it gets no `style` prop.
 */
const useFloatingPanel = ({ isOpen, anchorRef, panelRef, onClose, matchWidth = false, }: IFloatingPanelOptions) => {
  const place = useCallback(() => {
    const anchor = anchorRef.current?.getBoundingClientRect();
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    // the natural height, before a previous cap
    panel.style.maxHeight = '';
    const height = panel.offsetHeight;
    const width = matchWidth ? anchor.width : panel.offsetWidth;
    const spaceBelow = window.innerHeight - anchor.bottom - GAP_PX - EDGE_PX;
    const spaceAbove = anchor.top - GAP_PX - EDGE_PX;
    const isBelow = height <= spaceBelow || spaceBelow >= spaceAbove;
    const space = isBelow ? spaceBelow : spaceAbove;

    const left = Math.max(EDGE_PX, Math.min(anchor.left, window.innerWidth - width - EDGE_PX));
    Object.assign(panel.style, {
      left: `${left}px`,
      width: matchWidth ? `${width}px` : '',
      top: isBelow ? `${anchor.bottom + GAP_PX}px` : '',
      bottom: isBelow ? '' : `${window.innerHeight - anchor.top + GAP_PX}px`,
      maxHeight: height > space ? `${Math.max(space, 0)}px` : '',
      visibility: 'visible',
    });
  }, [anchorRef, panelRef, matchWidth]);

  useLayoutEffect(() => {
    if (isOpen) place();
  }, [isOpen, place]);

  useEffect(() => {
    if (!isOpen) return;
    const isInside = (target: EventTarget | null) => target instanceof Node
      && (!!anchorRef.current?.contains(target) || !!panelRef.current?.contains(target));

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!isInside(event.target)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    const onScroll = (event: Event) => {
      if (!(event.target instanceof Node && panelRef.current?.contains(event.target))) onClose();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', place);
    };
  }, [isOpen, anchorRef, panelRef, onClose, place]);

  return { place, };
};

export default useFloatingPanel;
