import React from "react";
import Navbar from "../components/Navbar";
import "./StatsPage.css";

export default function StatsPage() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <h1 className="hero-title">We keep all the stats!</h1>
      </div>
      <div className="card-container">
        <div className="card-box">
          <h3>Disposals </h3>
        </div>
        <div className="card-box">
          <h3>Kicks </h3>
        </div>
        <div className="card-box">
          <h3>Handballs </h3>
        </div>
        <div className="card-box">
          <h3>Contested Possessions </h3>
        </div>
        <div className="card-box">
          <h3>Tackles </h3>
        </div>
        <div className="card-box">
          <h3>Hitouts </h3>
        </div>
      </div>
    </div>
  );
}