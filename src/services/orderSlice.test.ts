import orderReducer, { createOrder, clearOrderModalData } from './orderSlice';
import { TOrder } from '../utils/types';

describe('orderSlice', () => {
  const initialState = {
    order: null,
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '123',
    status: 'done',
    name: 'Test Burger',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345,
    ingredients: ['ingredient1', 'ingredient2']
  };

  describe('reducers', () => {
    test('should clear order modal data', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };

      const state = orderReducer(stateWithOrder, clearOrderModalData());

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('createOrder async thunk', () => {
    test('should set orderRequest to true when createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set order and orderModalData when createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('should set error when createOrder.rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('should use default error message when createOrder.rejected without message', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {}
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Failed to create order');
    });

    test('should clear previous error when createOrder.pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };
      const action = { type: createOrder.pending.type };
      const state = orderReducer(stateWithError, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });
  });
});
