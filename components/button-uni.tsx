import React from "react";
function button({ children }: { children: React.ReactNode }) {
  return (
    <button className="uiverse">
      <div className="wrapper">
        <span>{children}</span>
        <div className="circle circle-12" />
        <div className="circle circle-11" />
        <div className="circle circle-10" />
        <div className="circle circle-9" />
        <div className="circle circle-8" />
        <div className="circle circle-7" />
        <div className="circle circle-6" />
        <div className="circle circle-5" />
        <div className="circle circle-4" />
        <div className="circle circle-3" />
        <div className="circle circle-2" />
        <div className="circle circle-1" />
      </div>
    </button>
  );
}

export default button;
