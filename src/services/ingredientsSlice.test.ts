import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../utils/types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Test Bun',
      type: 'bun',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 100,
      price: 50,
      image: 'test.png',
      image_mobile: 'test_mobile.png',
      image_large: 'test_large.png'
    },
    {
      _id: '2',
      name: 'Test Sauce',
      type: 'sauce',
      proteins: 5,
      fat: 10,
      carbohydrates: 15,
      calories: 50,
      price: 25,
      image: 'sauce.png',
      image_mobile: 'sauce_mobile.png',
      image_large: 'sauce_large.png'
    }
  ];

  describe('fetchIngredients async thunk', () => {
    test('should set loading to true when fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set ingredients and loading to false when fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('should set error and loading to false when fetchIngredients.rejected', () => {
      const errorMessage = 'Failed to fetch ingredients';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    test('should handle fetchIngredients.rejected with default error message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch ingredients');
    });

    test('should clear previous error when fetchIngredients.pending is dispatched', () => {
      const stateWithError = {
        ingredients: [],
        loading: false,
        error: 'Previous error'
      };
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });
});
