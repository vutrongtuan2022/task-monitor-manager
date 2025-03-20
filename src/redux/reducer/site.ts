import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SiteState {
	loading: boolean;
	isMobile: boolean;
	isRememberPassword: boolean;
}

const initialState: SiteState = {
	loading: true,
	isMobile: false,
	isRememberPassword: false,
};

export const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action?.payload;
		},
		setIsMobile: (state, action: PayloadAction<boolean>) => {
			state.isMobile = action.payload;
		},
		setRememberPassword: (state, action: PayloadAction<boolean>) => {
			state.isRememberPassword = action.payload;
		},
	},
});

export const {setLoading, setIsMobile, setRememberPassword} = siteSlice.actions;
// Action creators are generated for each case reducer function
export default siteSlice.reducer;
