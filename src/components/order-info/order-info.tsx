import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredients } from '../../services/ingredientsSlice';
import { getOrders, getUserOrders } from '../../services/ordersSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { fetchIngredients } from '../../services/slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);

  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const feedOrders = useSelector(getOrders);
  const userOrders = useSelector(getUserOrders);

  // Find order in either feed orders, user orders, or fetched order
  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number);
    const allOrders = [...feedOrders, ...userOrders];
    const foundOrder = allOrders.find((order) => order.number === orderNumber);

    return foundOrder || fetchedOrder;
  }, [number, feedOrders, userOrders, fetchedOrder]);

  // If order not found in store, fetch it from API
  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(parseInt(number))
        .then((response) => {
          if (response.success && response.orders.length > 0) {
            setFetchedOrder(response.orders[0]);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch order:', error);
        });
    }
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [orderData, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
