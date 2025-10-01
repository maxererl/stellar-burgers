import { combineSlices } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import orderReducer from './orderSlice';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';

export const rootReducer = combineSlices({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  auth: authReducer,
  orders: ordersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
