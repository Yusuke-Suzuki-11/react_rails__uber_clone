import React, { Fragment, useEffect } from "react";

// apis
import { fetchFoods } from "../apis/foods";

export const Foods = ({ match }) => {
  useEffect(() => {
    console.log(match);
    fetchFoods(match.params.restaurantsId).then((data) => console.log(data));
  }, []);
  return (
    <Fragment>
      フード一覧
      <p>restaurantsIdは {match.params.restaurantsId} です</p>
    </Fragment>
  );
};
