import React from "react";
import Header from "../components/Header";
import Link from "next/link";
import Footer from "../components/Footer";

function Home() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Header></Header>
      Pre-rendered React app using Next.js hosted on Firebase hosting and being
      pre-rendered by a GCP Cloud Function
      <Link href="/about">
        <a>About</a>
      </Link>
      <Link href="/contact">
        <a>Contact</a>
      </Link>
      <Footer></Footer>
    </div>
  );
}

export default Home;
