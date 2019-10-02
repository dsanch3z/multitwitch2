import React from "react";
import Link from "next/link";
import { FeedbackFormPopover } from "./feedback";

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <ul>
          <li>
            <FeedbackFormPopover />
          </li>
          <li>
            <a href="https://github.com/zeit/next.js">Github</a>
          </li>
        </ul>
      </li>
    </ul>

    <style jsx>{`
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
    `}</style>
  </nav>
);

export default Nav;
