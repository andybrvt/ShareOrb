import React from "react";

const Result = (props) => {
  return (
    <div>
      <li>
        <span>
          <b>Title:</b> {props.data.caption}
        </span>
        <span>
          <b>Author:</b> {props.data.created_at}
        </span>
      </li>
      <hr />
    </div>
  );
};

export default Result;
