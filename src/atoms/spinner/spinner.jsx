import React from "react";
import { Spin } from "antd";

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
    <Spin tip="Loading..." fullscreen={true} size="large" delay={100}></Spin>
  </div>
);

export default Spinner;