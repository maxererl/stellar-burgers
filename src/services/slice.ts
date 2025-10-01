import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import {
  TIngredient,
  TConstructorIngredient,
  TOrder,
  TUser
} from '../utils/types';
import { getIngredientsApi, orderBurgerApi } from '../utils/burger-api';

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.ingredients = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

export const { getIngredients, getLoading, getError } =
  ingredientsSlice.selectors;

// Burger Constructor Slice
type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const constructorInitialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: constructorInitialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getConstructorItems: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { getConstructorItems } = burgerConstructorSlice.selectors;

// Order Slice
type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const orderInitialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  error: null
};

// TODO: Add proper authorization token handling
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    // TODO: Replace with proper authorization when auth is implemented
    // For now using static token as requested
    const staticToken = 'Bearer your-static-token-here';

    // Temporarily set static token for development
    // This should be replaced with proper auth token
    document.cookie = `accessToken=${staticToken}; path=/`;

    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: orderInitialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
        state.orderModalData = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to create order';
      });
  },
  selectors: {
    getOrder: (state) => state.order,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getOrderError: (state) => state.error
  }
});

export const { clearOrderModalData } = orderSlice.actions;

export const { getOrder, getOrderRequest, getOrderModalData, getOrderError } =
  orderSlice.selectors;

// Auth Slice
type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const authInitialState: TAuthState = {
  user: null,
  isAuthChecked: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    // TODO: Add proper auth actions (login, logout, etc.) when auth is fully implemented
    mockLogin: (state) => {
      // Mock user for testing - replace with real auth later
      state.user = {
        email: 'test@example.com',
        name: 'Test User'
      };
      state.isAuthChecked = true;
    },
    mockLogout: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => !!state.user
  }
});

export const { setAuthChecked, setUser, mockLogin, mockLogout } =
  authSlice.actions;

export const { getUser, getIsAuthChecked, getIsAuthenticated } =
  authSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const orderReducer = orderSlice.reducer;
export const authReducer = authSlice.reducer;
