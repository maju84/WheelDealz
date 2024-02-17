import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

// Definition of the `State` type describing the shape of the store's state.
type State = {
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    searchTerm: string;
    orderBy: string;
}

// Definition of the `Action` type, describing functions to manipulate the state.
type Action = {
    setParams: (params: Partial<State>) => void; // Function to update parts of the state.
    reset: () => void;                           // Function to reset the state to initial values.
}

// The initial state of the store, setting default values for all state parts.
const initialState: State = {
    pageNumber: 1,
    pageSize: 8,
    pageCount: 1,
    searchTerm: '',
    orderBy: ''
};

// Creation of the store using Zustand. generic `State & Action` combines state structure with actions.
export const useParamsStore = createWithEqualityFn<State & Action>(
    (set) => ({

    ...initialState,    // initialize store with initial state using spread operator '...'

    setParams: (newParams: Partial<State>) => { // allows partial update of the store's state.
        console.log("Updating params with:", newParams);
        // `set` is a Zustand function to update the store's state. x
        // It accepts a callback with the current state.
        set((state) => {

            // Here we check if pageNumber is explicitly provided in newParams            
            if (newParams.pageNumber) {

                // `pageNumber` is provided: return existing state and update pageNumber inside that state
                return { ...state, pageNumber: newParams.pageNumber };

            } else {
                // problem example: we are on last page and set pageSize to something higher -> "Loading..." :-(
                // therefore we reset pageNumber to 1

                // return existing state, update the state with newParams  and   reset pageNumber to 1
                return { ...state, ...newParams, pageNumber: 1 };   
            }
        });
    },

    // `reset` function to restore the state to its `initialState`
    reset: () => set(initialState),
}), shallow); // Pass shallow as the equality function directly to createWithEqualityFn