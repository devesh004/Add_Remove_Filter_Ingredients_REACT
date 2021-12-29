import React,{useState,useReducer,useEffect,useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http';

const ingredientReducer=(currentIngreidents,action)=>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngreidents,action.ingredient]
    case 'DELETE':
      return currentIngreidents.filter(ing=> ing.id!==action.id);
    default:
      throw new Error('Should not get there!')
  }
}

const Ingredients=()=> {
  const [useringredients,dispatch]=useReducer(ingredientReducer,[]);

  const {loading,data,errorData,sendRequest,reqExtra,reqIdentifier,clear}=useHttp();
  
   useEffect(()=>{
    if(!loading&&!errorData&&reqIdentifier==='REMOVE_INGREDIENT'){
      dispatch({type:'DELETE',id :reqExtra});
    }else if(!loading&&!errorData&&reqIdentifier==='ADD_INGREDIENT'){
      dispatch({type:'ADD', ingredient:{id:data.name,...reqExtra}})
    }
   },[data,reqExtra,reqIdentifier,loading])

   const searchedIngredientHandler=useCallback(searchedIngredients=>{
    dispatch({type:'SET' ,ingredients:searchedIngredients})
   },[]);

  const addIngredientHandler=useCallback(ingredient=>{
    sendRequest('https://react-hooks-update-ce558-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json',
    'POST',
    JSON.stringify(ingredient),
    ingredient,
    'ADD_INGREDIENT'
    )
  },[]);

  const removeIngredientHandler=useCallback(ingredientId=>{
        sendRequest(
          `https://react-hooks-update-ce558-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingredientId}.json`,
          'DELETE',
          null,
          ingredientId,
          'REMOVE_INGREDIENT'
        )
  },[sendRequest]);

  const ingredientList=useMemo(()=>{
    return <IngredientList ingredients={useringredients} onRemoveItem={removeIngredientHandler}/>
  },[useringredients,removeIngredientHandler])
  
  return (
    <div className="App">
      {errorData && <ErrorModal onClose={clear}>{errorData}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={loading}/>
      <section>
        <Search onLoadIngredients={searchedIngredientHandler}/>
        {ingredientList}
      </section>
    </div>
  );  
}

export default Ingredients;
