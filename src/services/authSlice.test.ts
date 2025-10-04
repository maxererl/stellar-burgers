import authReducer, {
  loginUser,
  registerUser,
  checkUserAuth,
  logoutUser,
  updateUser,
  forgotPassword,
  setAuthChecked,
  clearError
} from './authSlice';
import { TUser } from '../utils/types';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loginRequest: false,
    registerRequest: false,
    updateRequest: false,
    forgotPasswordRequest: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('reducers', () => {
    test('should set auth checked status', () => {
      const state = authReducer(initialState, setAuthChecked(true));

      expect(state.isAuthChecked).toBe(true);
    });

    test('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });
  });

  describe('loginUser async thunk', () => {
    test('should set loginRequest to true when loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.loginRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set user and update state when loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.loginRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set error when loginUser.rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.loginRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('should use default error message when loginUser.rejected without message', () => {
      const action = {
        type: loginUser.rejected.type,
        error: {}
      };
      const state = authReducer(initialState, action);

      expect(state.loginRequest).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  });

  describe('registerUser async thunk', () => {
    test('should set registerRequest to true when registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.registerRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set user and update state when registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.registerRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set error when registerUser.rejected', () => {
      const errorMessage = 'User already exists';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.registerRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('should use default error message when registerUser.rejected without message', () => {
      const action = {
        type: registerUser.rejected.type,
        error: {}
      };
      const state = authReducer(initialState, action);

      expect(state.registerRequest).toBe(false);
      expect(state.error).toBe('Registration failed');
    });
  });

  describe('checkUserAuth async thunk', () => {
    test('should clear error when checkUserAuth.pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };
      const action = { type: checkUserAuth.pending.type };
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    test('should set user when checkUserAuth.fulfilled', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should set isAuthChecked to true when checkUserAuth.rejected', () => {
      const action = {
        type: checkUserAuth.rejected.type,
        error: { message: 'No access token' }
      };
      const state = authReducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('logoutUser async thunk', () => {
    test('should clear error when logoutUser.pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };
      const action = { type: logoutUser.pending.type };
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    test('should clear user when logoutUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });

    test('should set error when logoutUser.rejected', () => {
      const errorMessage = 'Logout failed';
      const action = {
        type: logoutUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUser async thunk', () => {
    test('should set updateRequest to true when updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.updateRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should update user when updateUser.fulfilled', () => {
      const updatedUser: TUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = authReducer(initialState, action);

      expect(state.updateRequest).toBe(false);
      expect(state.user).toEqual(updatedUser);
      expect(state.error).toBeNull();
    });

    test('should set error when updateUser.rejected', () => {
      const errorMessage = 'Failed to update user';
      const action = {
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.updateRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('forgotPassword async thunk', () => {
    test('should set forgotPasswordRequest to true when forgotPassword.pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = authReducer(initialState, action);

      expect(state.forgotPasswordRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should clear request state when forgotPassword.fulfilled', () => {
      const action = {
        type: forgotPassword.fulfilled.type,
        payload: 'test@example.com'
      };
      const state = authReducer(initialState, action);

      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.error).toBeNull();
    });

    test('should set error when forgotPassword.rejected', () => {
      const errorMessage = 'Failed to send reset email';
      const action = {
        type: forgotPassword.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
