import type { ComponentType, LazyExoticComponent } from "react";

export type TransitionKind =
  | "goldPath"
  | "circle"
  | "zoom"
  | "parallax"
  | "shared"
  | "curtain"
  | "fold";

export type SlideProps = {
  step: number;
};

export type SlideDef = {
  id: string;
  /** Arabic label used by the overview + help panel */
  title: string;
  /** number of fragment states, step ranges 0..steps-1 */
  steps: number;
  transition: TransitionKind;
  Component: LazyExoticComponent<ComponentType<SlideProps>>;
  /** used to warm up the next chunk while presenting */
  preload?: () => Promise<unknown>;
};

export type DeckPosition = { index: number; step: number };
