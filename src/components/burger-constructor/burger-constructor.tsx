import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorItems,
  clearConstructor
} from '../../services/burgerConstructorSlice';
import {
  createOrder,
  getOrderRequest,
  getOrderModalData,
  clearOrderModalData
} from '../../services/orderSlice';
import { getIsAuthenticated } from '../../services/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page for unauthorized users
      navigate('/login');
      return;
    }

    // Prepare ingredients array for API call
    const ingredientIds: string[] = [];

    // Add bun twice (top and bottom)
    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
      ingredientIds.push(constructorItems.bun._id);
    }

    // Add all other ingredients
    constructorItems.ingredients.forEach((ingredient) => {
      ingredientIds.push(ingredient._id);
    });

    // Create order and clear constructor on success
    dispatch(createOrder(ingredientIds)).then((result) => {
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // Transform data for UI component
  const constructorItemsForUI = {
    bun: constructorItems.bun,
    ingredients: constructorItems.ingredients
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItemsForUI}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
