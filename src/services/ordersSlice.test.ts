import ordersReducer, {
  fetchFeeds,
  fetchUserOrders,
  clearError,
  clearUserOrdersError
} from './ordersSlice';
import { TOrder } from '../utils/types';

describe('ordersSlice', () => {
  const initialState = {
    orders: [],
    userOrders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    userOrdersLoading: false,
    error: null,
    userOrdersError: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Test Burger 1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 100,
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Test Burger 2',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
      number: 101,
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  const mockFeedsResponse = {
    orders: mockOrders,
    total: 1000,
    totalToday: 50
  };

  describe('reducers', () => {
    test('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };

      const state = ordersReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });

    test('should clear user orders error', () => {
      const stateWithError = {
        ...initialState,
        userOrdersError: 'Some error'
      };

      const state = ordersReducer(stateWithError, clearUserOrdersError());

      expect(state.userOrdersError).toBeNull();
    });
  });

  describe('fetchFeeds async thunk', () => {
    test('should set loading to true when fetchFeeds.pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set orders and stats when fetchFeeds.fulfilled', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsResponse
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
      expect(state.error).toBeNull();
    });

    test('should set error when fetchFeeds.rejected', () => {
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('should use default error message when fetchFeeds.rejected without message', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: {}
      };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch orders');
    });

    test('should clear previous error when fetchFeeds.pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };
      const action = { type: fetchFeeds.pending.type };
      const state = ordersReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchUserOrders async thunk', () => {
    test('should set userOrdersLoading to true when fetchUserOrders.pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.userOrdersLoading).toBe(true);
      expect(state.userOrdersError).toBeNull();
    });

    test('should set userOrders when fetchUserOrders.fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = ordersReducer(initialState, action);

      expect(state.userOrdersLoading).toBe(false);
      expect(state.userOrders).toEqual(mockOrders);
      expect(state.userOrdersError).toBeNull();
    });

    test('should set userOrdersError when fetchUserOrders.rejected', () => {
      const errorMessage = 'Failed to fetch user orders';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state.userOrdersLoading).toBe(false);
      expect(state.userOrdersError).toBe(errorMessage);
    });

    test('should use default error message when fetchUserOrders.rejected without message', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: {}
      };
      const state = ordersReducer(initialState, action);

      expect(state.userOrdersLoading).toBe(false);
      expect(state.userOrdersError).toBe('Failed to fetch user orders');
    });

    test('should clear previous error when fetchUserOrders.pending', () => {
      const stateWithError = {
        ...initialState,
        userOrdersError: 'Previous error'
      };
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(stateWithError, action);

      expect(state.userOrdersLoading).toBe(true);
      expect(state.userOrdersError).toBeNull();
    });
  });

  describe('independent loading states', () => {
    test('fetchFeeds should not affect userOrdersLoading', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.userOrdersLoading).toBe(false);
    });

    test('fetchUserOrders should not affect loading', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.userOrdersLoading).toBe(true);
      expect(state.loading).toBe(false);
    });

    test('fetchFeeds error should not affect userOrdersError', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: 'Feeds error' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.error).toBe('Feeds error');
      expect(state.userOrdersError).toBeNull();
    });

    test('fetchUserOrders error should not affect error', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'User orders error' }
      };
      const state = ordersReducer(initialState, action);

      expect(state.userOrdersError).toBe('User orders error');
      expect(state.error).toBeNull();
    });
  });
});
