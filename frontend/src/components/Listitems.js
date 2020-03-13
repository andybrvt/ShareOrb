import React from "react";

const Result = (props) => {
  return (
    <div>
      <li>
        <span>
          <b>Title:</b> {props.data.first_name}
        </span>
        <span>
          <b>Author:</b> {props.data.last_name}
        </span>
      </li>
      <hr />
    </div>
  );
};

export default Result;
