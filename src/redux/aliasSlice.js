import { createSlice, isDraft } from '@reduxjs/toolkit'

const initialState = {
  alias: [],
}

export const aliasSlice = createSlice(
    {
        name: 'alias',
        initialState,
        reducers: {
          addAlias: (state, action) =>{
            state.alias.push(action.payload);
          },
          removeAlias: (state, action) => {
            state.alias = state.alias.filter((item) => item.id !== action.payload.id)
          },
          modifyAlias: (state, action) => {
            const updatedAlias = action.payload;
            state.alias = state.alias.map(al =>
              al.id === updatedAlias.id ? updatedAlias : ev
            );
          }
        }
        
    }
)

export const {addAlias, removeAlias, modifyAlias} = aliasSlice.actions

export default aliasSlice.reducer;