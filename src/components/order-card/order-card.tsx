import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import {
  fetchIngredients,
  getIngredients
} from '../../services/ingredientsSlice';
import { useDispatch } from '../../services/store';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const ingredients = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) dispatch(fetchIngredients());

    // Map order ingredients to actual ingredient data
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Calculate total price from all ingredients
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Limit ingredients shown in UI to maxIngredients
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Calculate how many ingredients are not shown
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Parse and format the order date
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
