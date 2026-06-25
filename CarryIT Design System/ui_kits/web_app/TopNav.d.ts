import * as React from 'react';

export interface TopNavProps {
  /** Currently active view tab. */
  activeView: 'vision' | 'jalons' | 'todo';
  /** Called with the id of the tab the user selects. */
  onChange: (view: 'vision' | 'jalons' | 'todo') => void;
}

/**
 * CarryIT top navigation bar — brand + project dropdown on the top row,
 * three view tabs (Vision / Jalons / To-do) below. Active tab uses a white
 * underline (not orange), per the dashboard spec.
 */
export function TopNav(props: TopNavProps): React.JSX.Element;
