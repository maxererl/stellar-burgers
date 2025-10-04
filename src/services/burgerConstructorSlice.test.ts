import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient } from '../utils/types';

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockIngredient: TIngredient = {
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
  };

  describe('addIngredient', () => {
    test('should add bun to state', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toMatchObject({
        _id: '1',
        name: 'Test Bun',
        type: 'bun'
      });
      expect(state.bun).toHaveProperty('id');
      expect(state.ingredients).toHaveLength(0);
    });

    test('should replace existing bun', () => {
      const stateWithBun = {
        bun: { ...mockBun, id: 'old-id' },
        ingredients: []
      };

      const newBun: TIngredient = {
        ...mockBun,
        _id: '3',
        name: 'New Bun'
      };

      const state = burgerConstructorReducer(
        stateWithBun,
        addIngredient(newBun)
      );

      expect(state.bun).toMatchObject({
        _id: '3',
        name: 'New Bun'
      });
    });

    test('should add ingredient to ingredients array', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        _id: '2',
        name: 'Test Sauce',
        type: 'sauce'
      });
      expect(state.ingredients[0]).toHaveProperty('id');
      expect(state.bun).toBeNull();
    });

    test('should add multiple ingredients', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = burgerConstructorReducer(state, addIngredient(mockIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    test('should remove ingredient by id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockIngredient, id: 'id-2' },
          { ...mockIngredient, id: 'id-3' }
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        removeIngredient('id-2')
      );

      expect(state.ingredients).toHaveLength(2);
      expect(
        state.ingredients.find((ing) => ing.id === 'id-2')
      ).toBeUndefined();
      expect(state.ingredients.find((ing) => ing.id === 'id-1')).toBeDefined();
      expect(state.ingredients.find((ing) => ing.id === 'id-3')).toBeDefined();
    });

    test('should not change state when removing non-existent id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: 'id-1' }]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    test('should move ingredient from one position to another', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'First' },
          { ...mockIngredient, id: 'id-2', name: 'Second' },
          { ...mockIngredient, id: 'id-3', name: 'Third' }
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients[0].name).toBe('Second');
      expect(state.ingredients[1].name).toBe('Third');
      expect(state.ingredients[2].name).toBe('First');
    });

    test('should move ingredient down in the list', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'First' },
          { ...mockIngredient, id: 'id-2', name: 'Second' },
          { ...mockIngredient, id: 'id-3', name: 'Third' }
        ]
      };

      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(state.ingredients[0].name).toBe('Third');
      expect(state.ingredients[1].name).toBe('First');
      expect(state.ingredients[2].name).toBe('Second');
    });
  });

  describe('clearConstructor', () => {
    test('should clear all ingredients and bun', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [{ ...mockIngredient, id: 'id-1' }]
      };

      const state = burgerConstructorReducer(stateWithData, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
