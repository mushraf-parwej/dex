import React from "react";

import { Dock, DockIcon } from "../dock";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo() {
  return (
    <div className="relative">
      <Dock className="space-x-5" direction="middle">
        <DockIcon>
          <h1>Swap</h1>
        </DockIcon>
        <DockIcon className="w-fit">
          <h1>Limit</h1>
        </DockIcon>
        <DockIcon>
          <h1>Home</h1>
        </DockIcon>
        <DockIcon>
          <h1>Home</h1>
        </DockIcon>
      </Dock>
    </div>
  );
}
