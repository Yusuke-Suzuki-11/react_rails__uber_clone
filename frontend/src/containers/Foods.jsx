import React, { Fragment, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { COLORS } from "../style_constants";
import { LocalMallIcon } from "../Icons";
import { FoodWrapper } from "../components/FoodWrapper";
import { Link, useHistory } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";

import MainLogo from "../images/logo.png";
import FoodImage from "../images/food-image.jpg";
import { FoodOrderDialog } from "../components/FoodOrderDialog";
import { NewOrderConfirmDialog } from "../components/NewOrderConfirmDialog";

import {
  initialState as foodsInitialState,
  foodsActionTyps,
  foodsReducer,
} from "../reducers/foods";

import { HTTP_STATUS_CODE, REQUEST_STATE } from "../constants";

// apis
import { fetchFoods } from "../apis/foods";
import { Divider } from "@material-ui/core";
import { postLineFoods, replaceLineFoods } from "../apis/line_foods";

export const Foods = ({ match }) => {
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);

  const history = useHistory();

  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    })
      .then(() => history.push("/orders"))
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingResutaurautName: e.response.data.existing_restaurant,
            newResutaurautName: e.response.data.new_restaurant,
          });
        } else {
          throw e;
        }
      });
  };

  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingResutaurautName: "",
    newResutaurautName: "",
  };
  
  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
  };


  const [state, setState] = useState(initialState);

  useEffect(() => {
    dispatch({ type: foodsActionTyps.FETCHING });
    fetchFoods(match.params.restaurantsId).then((data) =>
      dispatch({
        type: foodsActionTyps.FETCH_SUCCESS,
        payload: {
          foods: data.foods,
        },
      })
    );
  }, []);
  return (
    
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {foodsState.fetchState === REQUEST_STATE.LOADING ? (
          <Fragment>
            {[...Array(12).keys()].map((i) => (
              <ItemWrapper key={i}>
                <Skeleton key={i} variant="rect" width={450} height={180} />
              </ItemWrapper>
            ))}
          </Fragment>
        ) : (
          foodsState.foodsList.map((food) => (
            <ItemWrapper key={food.id}>
              <FoodWrapper
                food={food}
                onClickFoodWrapper={(food) =>
                  setState({
                    ...state,
                    isOpenOrderDialog: true,
                    selectedFood: food,
                  })
                }
                imageUrl={FoodImage}
              />
            </ItemWrapper>
          ))
        )}
      </FoodsList>
      {state.isOpenOrderDialog && (
        <FoodOrderDialog
          isOpen={state.isOpenOrderDialog}
          food={state.selectedFood}
          countNumber={state.selectedFoodCount}
          onClickCountUp={() =>
            setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
            })
          }
          onClickCountDown={() =>
            setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
            })
          }
          // 先ほど作った関数を渡します
          onClickOrder={() => submitOrder()}
          // モーダルを閉じる時はすべてのstateを初期化する
          onClose={() =>
            setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1,
            })
          }
        />
      )}
      {
      state.isOpenNewOrderDialog &&
      <NewOrderConfirmDialog
        isOpen={state.isOpenNewOrderDialog}
        onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
        existingResutaurautName={state.existingResutaurautName}
        newResutaurautName={state.newResutaurautName}
        onClickSubmit={() => replaceOrder()}
      />
    }
    </Fragment>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;
