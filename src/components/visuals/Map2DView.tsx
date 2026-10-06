"use client";

import React from "react";
import { AdvancedMap, AdvancedMapProps } from "./AdvancedMap";

export type Map2DViewProps = AdvancedMapProps;

export const Map2DView: React.FC<Map2DViewProps> = (props) => {
  return <AdvancedMap {...props} />;
};

export default Map2DView;
