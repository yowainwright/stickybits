export interface StickybitsInstance {
  el: HTMLElement;
  parent: HTMLElement;
  props: StickyBitsProps;
  state?: string;
  stateChange?: string;
  stateContainer?: () => void;
  offset?: number;
  stickyStart?: number;
  stickyChange?: number;
  stickyStop?: number;
}

export interface StickbitsElAttributes {
  styles?: Record<string, string>;
  classes?: Record<string, string>;
}

export type ApplyStyle = (
  attrs: StickbitsElAttributes,
  instance: StickybitsInstance
) => void;

export interface StickybitsOptions {
  customStickyChangeNumber?: number | null;
  noStyles?: boolean;
  stickyBitStickyOffset?: number;
  parentClass?: string;
  positionVal?: string;
  scrollEl?: string | Window;
  stickyClass?: string;
  stuckClass?: string;
  stickyChangeClass?: string;
  useStickyClasses?: boolean;
  useFixed?: boolean;
  useGetBoundingClientRect?: boolean;
  verticalPosition?: string;
  applyStyle?: ApplyStyle;
}

export interface StickybitsClassOptions
  extends Omit<StickybitsOptions, "scrollEl"> {
  scrollEl: string | Window;
}

export interface StickyBitsProps extends StickybitsClassOptions {
  customStickyChangeNumber: number | null;
  noStyles: boolean;
  stickyBitStickyOffset: number;
  parentClass: string;
  positionVal: string;
  scrollEl: string | Window;
  stickyClass: string;
  stuckClass: string;
  stickyChangeClass: string;
  useStickyClasses: boolean;
  useFixed: boolean;
  useGetBoundingClientRect: boolean;
  verticalPosition: string;
  applyStyle: ApplyStyle;
}

class Stickybits {
  public els: HTMLElement | NodeListOf<HTMLElement> | HTMLElement[];
  public version: string;
  public userAgent: string;
  public props: StickyBitsProps;
  public instances: Array<StickybitsInstance>;
  private isWin: undefined | boolean;
  constructor(target: string | HTMLElement, options: StickybitsClassOptions) {
    this.version = "VERSION";
    this.userAgent =
      window.navigator.userAgent || "no `userAgent` provided by the browser";
    const {
      customStickyChangeNumber = null,
      noStyles = false,
      stickyBitStickyOffset = 0,
      parentClass = "js-sticky-parent",
      scrollEl,
      stickyClass = "js-is-sticky",
      stuckClass = "js-is-stuck",
      stickyChangeClass = "js-is-sticky-change",
      useStickyClasses = false,
      useFixed = false,
      useGetBoundingClientRect = false,
      verticalPosition = "top",
      applyStyle = ({ styles, classes }, instance) =>
        this.applyStyle({ styles, classes }, instance),
    } = options;

    const positionVal = this.definePosition();
    this.props = {
      customStickyChangeNumber,
      noStyles,
      stickyBitStickyOffset,
      parentClass,
      scrollEl,
      stickyClass,
      stuckClass,
      stickyChangeClass,
      useStickyClasses,
      useFixed,
      useGetBoundingClientRect,
      verticalPosition,
      applyStyle,
      positionVal,
    };

    this.instances = [];

    const verticalPositionStyle =
      verticalPosition === "top" && !noStyles
        ? `${stickyBitStickyOffset}px`
        : "";
    const positionStyle = positionVal !== "fixed" ? positionVal : "";

    this.els =
      typeof target === "string" ? document.querySelectorAll(target) : target;

    if (!("length" in this.els)) this.els = [this.els];

    this.els.forEach((el) => {
      const instance = this.addInstance(el, this.props);
      // return instance, parent is required
      if (!instance) return;
      this.applyStyle(
        {
          styles: {
            [verticalPosition]: verticalPositionStyle,
            position: positionStyle,
          },
          classes: {},
        },
        instance
      );
      this.manageState(instance);
      this.instances.push(instance);
    });
  }

  definePosition(): string {
    if (this.props.useFixed) {
      return "fixed";
    } else {
      const position = ["", "-o-", "-webkit-", "-moz-", "-ms-"].find((item) =>
        document.head.style.position.includes(`${item}sticky`)
      );
      return position && position?.length > 0 ? `${position}sticky` : "fixed";
    }
  }

  addInstance(
    el: HTMLElement,
    props: StickyBitsProps
  ): StickybitsInstance | void {
    const parent = el.parentNode as HTMLElement;
    const { positionVal, useStickyClasses, scrollEl } = props;
    if (positionVal === "fixed" || useStickyClasses) {
      this.isWin = scrollEl === window;
      const se = this.isWin
        ? window
        : typeof scrollEl === "string"
        ? el.closest(scrollEl)
        : window;
      if (se === null) {
        console.error('Stickybits: "scrollEl" not found');
        return;
      }
      const instance = {
        el,
        parent,
        props,
        state: "default",
        stateChange: "default",
      };
      this.computeScrollOffsets(instance);
      if (parent) parent.classList.toggle(props.parentClass);
      const stateContainer = () => this.manageState(instance);
      se.addEventListener("scroll", stateContainer);
      return {
        ...instance,
        stateContainer,
      };
    }
    return {
      el,
      parent,
      props,
    };
  }

  getTopPosition(el: HTMLElement): number {
    const { scrollEl, useGetBoundingClientRect } = this.props;
    if (useGetBoundingClientRect) {
      // yes, some legacy code here
      return (
        el.getBoundingClientRect().top +
        ((scrollEl as Window).pageYOffset || document.documentElement.scrollTop)
      );
    }
    let topPosition = 0;
    do {
      topPosition = el.offsetTop + topPosition;
    } while (el === el.offsetParent);
    return topPosition;
  }

  computeScrollOffsets(instance: StickybitsInstance) {
    const { el, parent, props } = instance;
    const { verticalPosition, positionVal } = props;
    const isCustom = !this.isWin && positionVal === "fixed";
    const isTop = verticalPosition !== "bottom";
    let scrollElOffset = 0;
    if (isCustom && props.scrollEl !== window) {
      const scrollEl = document.querySelector(props.scrollEl as string);
      scrollElOffset = this.getTopPosition(scrollEl as HTMLElement);
    }
    const stickyStart = isCustom
      ? this.getTopPosition(parent) - scrollElOffset
      : this.getTopPosition(parent);
    const stickyChangeOffset =
      props.customStickyChangeNumber !== null
        ? props.customStickyChangeNumber
        : el.offsetHeight;
    const parentBottom = stickyStart + parent.offsetHeight;
    instance.offset = !isCustom
      ? scrollElOffset + props.stickyBitStickyOffset
      : 0;
    instance.stickyStart = isTop ? stickyStart - instance.offset : 0;
    instance.stickyChange = instance.stickyStart + stickyChangeOffset;
    instance.stickyStop = isTop
      ? parentBottom - (el.offsetHeight + instance.offset)
      : parentBottom - window.innerHeight;
  }

  manageState(instance: StickybitsInstance) {
    // cache object
    const it = instance;
    const p = it.props;
    const state = it.state;
    const stateChange = it.stateChange;
    const start = it.stickyStart;
    const change = it.stickyChange;
    const stop = it.stickyStop;
    // cache props
    const pv = p.positionVal;
    const se = p.scrollEl;
    const sticky = p.stickyClass;
    const stickyChange = p.stickyChangeClass;
    const stuck = p.stuckClass;
    const vp = p.verticalPosition;
    const isTop = vp !== "bottom";
    const aS = p.applyStyle;
    const ns = p.noStyles;

    const rAFStub = (cb: () => void) => cb();
    const rAF = !this.isWin
      ? rAFStub
      : window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        rAFStub;

    const scroll = this.isWin
      ? window.scrollY || window.pageYOffset
      : se.scrollTop;
    const notSticky =
      scroll > start &&
      scroll < stop &&
      (state === "default" || state === "stuck");
    const isSticky =
      isTop && scroll <= start && (state === "sticky" || state === "stuck");
    const isStuck = scroll >= stop && state === "sticky";

    if (notSticky) {
      it.state = "sticky";
    } else if (isSticky) {
      it.state = "default";
    } else if (isStuck) {
      it.state = "stuck";
    }

    const isStickyChange = scroll >= change && scroll <= stop;
    const isNotStickyChange = scroll < change / 2 || scroll > stop;
    if (isNotStickyChange) {
      it.stateChange = "default";
    } else if (isStickyChange) {
      it.stateChange = "sticky";
    }

    // Only apply new styles if the state has changed
    if (state === it.state && stateChange === it.stateChange) return;
    rAF(() => {
      const stateStyles = {
        sticky: {
          styles: {
            position: pv,
            top: "",
            bottom: "",
            [vp]: `${p.stickyBitStickyOffset}px`,
          },
          classes: { [sticky]: true },
        },
        default: {
          styles: {
            [vp]: "",
          },
          classes: {},
        },
        stuck: {
          styles: {
            [vp]: "",
            /**
             * leave !this.isWin
             * @example https://codepen.io/yowainwright/pen/EXzJeb
             */
            ...((pv === "fixed" && !ns) || !this.isWin
              ? {
                  position: "absolute",
                  top: "",
                  bottom: "0",
                }
              : {}),
          },
          classes: { [stuck]: true },
        },
      };

      if (pv === "fixed") {
        stateStyles.default.styles.position = "";
      }

      const style = stateStyles[it.state];
      style.classes = {
        [stuck]: !!style.classes[stuck],
        [sticky]: !!style.classes[sticky],
        [stickyChange]: isStickyChange,
      };

      aS(style, item);
    });
  }

  applyStyle(
    { styles, classes }: StickbitsElAttributes,
    instance: StickybitsInstance
  ) {
    const { el, props } = instance;

    const cArray = el.className.split(" ");
    for (const cls in classes) {
      const addClass = classes[cls];
      if (addClass) {
        if (cArray.indexOf(cls) === -1) cArray.push(cls);
      } else {
        const idx = cArray.indexOf(cls);
        if (idx !== -1) cArray.splice(idx, 1);
      }
    }

    el.className = cArray.join(" ");

    if (styles?.["position"]) {
      el.style["position"] = styles["position"];
    }

    if (props.noStyles) return;

    for (const key in styles) {
      el.style[key as any] = styles[key];
    }
  }

  update(updatedProps = null) {
    this.instances.forEach((instance) => {
      this.computeScrollOffsets(instance);
      if (updatedProps) {
        for (const updatedProp in updatedProps as StickyBitsProps) {
          instance.props[updatedProp as keyof StickyBitsProps] =
            updatedProps[updatedProp];
        }
      }
    });

    return this;
  }

  removeInstance(instance: StickybitsInstance) {
    const { parent, props } = instance;
    const { verticalPosition, stuckClass, stickyClass, parentClass } = props;
    this.applyStyle(
      {
        styles: { position: "", [verticalPosition]: "" },
        classes: { [stickyClass]: "", [stuckClass]: "" },
      },
      instance
    );
    parent.classList.toggle(parentClass);
  }

  cleanup() {
    this.instances.forEach((instance) => {
      const {
        stateContainer,
        props: { scrollEl },
      } = instance;
      if (stateContainer) {
        const stateEl =
          typeof scrollEl === "string"
            ? document.querySelector(scrollEl)
            : scrollEl;
        if (stateEl !== null && stateContainer)
          stateEl.removeEventListener("scroll", stateContainer);
        this.removeInstance(instance);
      }
    });
    this.instances = [];
  }
}

/**
 * stickybits
 * @param target
 * @param options
 * @returns void
 * @todo: should definitely change this to a factory function
 */
const stickybits = (
  target: HTMLElement | string,
  options: StickybitsOptions
) => {
  // fail if no target
  if (!target) return console.error("Stickybits: No target provided");
  const { scrollEl = window } = options;
  const isNoValidScrollEl =
    scrollEl === window
      ? window
      : document.querySelector<HTMLElement>(scrollEl as string);
  // fail if no scrollEl
  if (!isNoValidScrollEl) return console.error("Stickybits: No scroll element");
  new Stickybits(target, { ...options, scrollEl });
};
export default stickybits;
