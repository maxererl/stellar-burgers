import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  test('should initialize with correct initial state on unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: expect.any(Object),
      auth: expect.any(Object),
      orders: expect.any(Object)
    });
  });
});
